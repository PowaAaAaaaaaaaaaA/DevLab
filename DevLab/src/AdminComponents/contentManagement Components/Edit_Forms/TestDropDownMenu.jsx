
const blockTypes = ["Header", "Paragraph", "Divider"]; // 

function TestDropDownMenu({ selectedItem, setSelectedItem }) {
  return (
    <select
      value={selectedItem}
      onChange={(e) => setSelectedItem(e.target.value)}
      className="w-full bg-[#0d13207c] text-white border border-cyan-400 rounded-2xl p-2 focus:outline-none">
      <option value="">Select a Block Type</option>
      {blockTypes.map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </select>
  );
}

export default TestDropDownMenu;
