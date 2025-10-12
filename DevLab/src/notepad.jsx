<h1 className='text-[#1E90FF] font-exo font-bold text-5xl text-shadow-lg/30'>CSS ACHIEVEMENTS</h1>
<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 w-full h-[100%]'>
{CssData?.map((item) => {
  const isUnlocked = !!userAchievements?.[item.id];
  const isClaimed = isUnlocked && userAchievements[item.id]?.claimed;
  console.log(`${item.id} - ${isClaimed}`)
  return (
    <div
      key={item.id}
      className={`p-[2px] rounded-xl bg-gradient-to-b from-cyan-400 to-purple-500 transition duration-500
        hover:scale-110 hover:shadow-lg hover:shadow-gray-400
        ${isUnlocked ? "opacity-100 " : "opacity-40 cursor-not-allowed hover:shadow-none"}`}>
      <div className="bg-[#0F172A] rounded-xl p-6 flex flex-col items-center text-center space-y-4 h-[100%]">
        <img src={item.image} alt="Achievements Icon" className="w-20 h-20" />
        <hr className="border-t border-gray-700 w-full" />
        <h3 className="text-white text-lg font-bold">{item.title}</h3>
        <p className="text-gray-400 text-sm">{item.description} </p>
<button 
onClick={() => isUnlocked && !isClaimed && handleClaim(item)}
className={`px-4 py-1 rounded-full font-semibold cursor-pointer 
  ${isClaimed ? "bg-green-500 text-white"       // COMPLETED
  : isUnlocked 
  ? "bg-yellow-500 text-black"    // UNCLAIMED
  : "bg-red-500 text-white"       // LOCKED
  }`}> 
{isClaimed ? "COMPLETED" : isUnlocked
    ? "UNCLAIMED" : "LOCKED"}
</button>
      </div>
    </div>
  );
})}
</div>