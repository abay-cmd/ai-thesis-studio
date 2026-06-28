import React, { useCallback, useState } from "react";
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowRight } from "lucide-react";

// Transform JSON nested structure to React Flow nodes/edges
const generateFlowElements = (rootData: any) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  let yOffset = 100;
  
  const traverse = (nodeData: any, parentId: string | null, x: number, y: number, level: number) => {
    const id = nodeData.id || Math.random().toString(36).substring(7);
    
    nodes.push({
      id,
      position: { x, y },
      data: { label: nodeData.label || "Concept" },
      className: level === 0 ? "bg-cyan-600/20 text-cyan-300 font-bold p-4 rounded-xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/40 backdrop-blur-xl text-center" 
                 : level === 1 ? "bg-white/5 text-slate-300 p-3 rounded-lg border border-white/10 backdrop-blur-md text-center"
                 : "bg-white/5 text-slate-400 p-2 rounded-lg border border-white/10 backdrop-blur-md text-center text-sm",
    });

    if (parentId) {
      edges.push({
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: id,
        animated: true,
        style: { stroke: "#06b6d430", strokeWidth: 2 },
      });
    }

    if (nodeData.children && nodeData.children.length > 0) {
      const childSpacing = 250;
      let startX = x - ((nodeData.children.length - 1) * childSpacing) / 2;
      
      nodeData.children.forEach((child: any) => {
        traverse(child, id, startX, y + 150, level + 1);
        startX += childSpacing;
      });
    }
  };

  if (rootData) {
    traverse(rootData, null, 500, 50, 0);
  }

  return { initialNodes: nodes, initialEdges: edges };
};

export const MindMapStudio = () => {
  const { currentProject, setCurrentProject } = useAppStore();
  const navigate = useNavigate();
  const [isPlanning, setIsPlanning] = useState(false);
  
  const { initialNodes, initialEdges } = React.useMemo(() => {
    return generateFlowElements(currentProject?.mindmap);
  }, [currentProject]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const planPresentation = async () => {
    setIsPlanning(true);
    try {
      const res = await fetch("/api/plan-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the updated graph structure if possible, for now just send original mindmap structure
        body: JSON.stringify({ mindmap: currentProject?.mindmap }),
      });
      const presentationData = await res.json();
      
      if (!res.ok) throw new Error(presentationData.error);

      setCurrentProject({
        ...currentProject,
        presentation: presentationData
      });

      navigate("/presentation");
    } catch (error) {
       console.error(error);
       alert("Failed to plan presentation.");
    } finally {
       setIsPlanning(false);
    }
  };

  if (!currentProject?.mindmap) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-gray-400">No mind map generated yet. Please create a project first.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] w-full flex flex-col">
      <div className="h-16 border-b border-white/5 bg-black/10 px-6 flex items-center justify-between backdrop-blur-md z-10 relative">
        <h2 className="text-xl font-semibold text-white">Mind Mapping Studio</h2>
        <button 
          onClick={planPresentation}
          disabled={isPlanning}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors disabled:opacity-50 shadow-lg shadow-cyan-500/20"
        >
          {isPlanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Plan Presentation</span>}
          {!isPlanning && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
      <div className="flex-1 bg-transparent relative z-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Background color="#222" gap={16} />
          <Controls className="bg-black/50 border border-white/10" />
        </ReactFlow>
      </div>
    </div>
  );
};
