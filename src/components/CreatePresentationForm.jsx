import React from "react";
import Plus from  "../assets/1.png";

export default function CreatePresentationForm({ onCreate }) {
  const handleCreate = () => {
    onCreate("Новая презентация");
  };

  return (
    <div className="flex flex-col pt-8 pb-8 div1">
      <button
        type="button"
        onClick={handleCreate}
        className="bg-white border rounded-lg w-56 h-36 flex items-center cursor-pointer justify-center shadow hover:shadow-lg hover:bg-gray-50 transition mb-2"
        style={{ outline: "none" }}
      >
        {/* SVG-плюс цветной, как на скрине */}
        <img src={Plus} alt="" />
        <div className="text-center text-base font-medium text-gray-800">
            Новая презентация
        </div>
      </button>
      
    </div>
  );
}
