import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableStage({ stage, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: stage.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : "none",
    transition: transition || "transform 200ms ease",
    padding: "10px",
    margin: "0%", // for horizontal spacing
    background: "#1F2937",
    color: "white",
    borderRadius: "8px",
    display: "inline-block",
    minWidth: "110px",
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
      <div  {...listeners} className="hover:bg-purple-600 h-[6px] cursor-grab rounded-3xl transition-colors duration-300"></div>
    </div>
  );
}
