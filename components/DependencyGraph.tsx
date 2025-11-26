import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PLAYBOOK_DATA } from '../constants';
import { Step } from '../types';

// Flatten data for the graph
interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  name: string;
  fullTitle: string;
  refId: string;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

const DependencyGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Prepare data
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const idMap = new Map<string, string>(); // Maps refId (ID 1) to stepId (1.1)

    // First pass: create nodes and map RefIDs
    PLAYBOOK_DATA.forEach(phase => {
      phase.steps.forEach(step => {
        nodes.push({
          id: step.id,
          group: phase.id,
          name: step.id,
          fullTitle: step.title,
          refId: step.refId
        });
        idMap.set(step.refId, step.id);
      });
    });

    // Second pass: create links
    PLAYBOOK_DATA.forEach(phase => {
      phase.steps.forEach(step => {
        step.dependencies.forEach(depRefId => {
          const targetId = idMap.get(depRefId);
          if (targetId) {
            links.push({
              source: targetId,
              target: step.id
            });
          }
        });
      });
    });

    // Clear previous SVG content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height]);

    // Define arrow markers
    svg.append("defs").selectAll("marker")
      .data(["end"])
      .join("marker")
      .attr("id", d => `arrow-${d}`)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#64748b")
      .attr("d", "M0,-5L10,0L0,5");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow-end)");

    const nodeGroup = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Node circles
    nodeGroup.append("circle")
      .attr("r", 20)
      .attr("fill", d => {
        const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]; // Colors for phases 1-4
        return colors[(d.group - 1) % colors.length];
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Node labels (ID)
    nodeGroup.append("text")
      .text(d => d.id)
      .attr("x", 0)
      .attr("y", 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "white")
      .style("pointer-events", "none");

    // Tooltip logic
    nodeGroup
      .on("mouseover", (event, d) => {
        setHoveredNode(d);
        d3.select(event.currentTarget).select("circle").attr("stroke", "#fff").attr("stroke-width", 4);
      })
      .on("mouseout", (event, d) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).select("circle").attr("stroke", "#fff").attr("stroke-width", 2);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
      <div className="absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur p-4 rounded-lg border border-slate-700 max-w-xs">
        <h3 className="text-sm font-bold text-slate-200 mb-2 uppercase tracking-wider">Dependency Knowledge Graph</h3>
        <p className="text-xs text-slate-400 mb-2">Visualizing the interdependencies between playbook IDs.</p>
        <div className="flex gap-2 flex-wrap text-xs">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Foundation</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Narrative</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500"></span> Crafting</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Oversight</span>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>

      {hoveredNode && (
        <div className="absolute bottom-4 right-4 z-10 bg-slate-800 p-4 rounded-lg border border-slate-600 shadow-2xl max-w-sm animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-blue-400">{hoveredNode.id} / {hoveredNode.refId}</span>
            <span className="text-xs font-bold text-slate-500">Phase {hoveredNode.group}</span>
          </div>
          <h4 className="font-bold text-white text-lg mb-1">{hoveredNode.fullTitle}</h4>
        </div>
      )}
    </div>
  );
};

export default DependencyGraph;
