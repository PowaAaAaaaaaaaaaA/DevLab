import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableStage({ stage, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stage.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : "none",
    transition: transition || "transform 200ms ease",
    padding: "8px",
    margin: "0%", // for horizontal spacing
    background: "#1F2937",
    color: "white",
    borderRadius: "8px",
    display: "inline-block",
    minWidth: "100px",
    textAlign: "center",
    height: "auto"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}  >
      <button 
        className="w-full h-full cursor-pointer"
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag from interfering
          onClick();
        }}>
        {stage.id}
      </button>
      <div  {...listeners} className="border hover:bg-amber-400 h-[6px] cursor-grab"></div>
    </div>
  );
}
