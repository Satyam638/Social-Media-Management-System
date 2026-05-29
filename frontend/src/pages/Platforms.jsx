function Platforms() {
  const platforms = [
    {
      name: "LinkedIn",
      status: "Not Connected"
    },
    {
      name: "Facebook",
      status: "Not Connected"
    },
    {
      name: "Instagram",
      status: "Not Connected"
    }
  ];

  return (
    <div className="platforms-page">
      <h1>Connected Platforms</h1>

      <div className="platform-list">
        {platforms.map((platform) => (
          <div key={platform.name} className="platform-card">
            <h2>{platform.name}</h2>

            <p>{platform.status}</p>

            <button>
              Connect {platform.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Platforms;