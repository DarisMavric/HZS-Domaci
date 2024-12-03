import React, { useState } from "react";
import "./Friends.css";
import profilePicture from "../../assets/profile.png";
import { FaUserPlus } from "react-icons/fa";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: "", status: "inactive" });

  const mockedUsers = [
    {
      id: 1,
      name: "John Doe",
      status: "active",
      profilePic: "https://example.com/john-doe.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      status: "inactive",
      profilePic: "https://example.com/jane-smith.jpg",
    },
    {
      id: 3,
      name: "Alice Johnson",
      status: "active",
      profilePic: "https://example.com/alice-johnson.jpg",
    },
  ];

  const handleAddFriend = () => {
    console.log("New friend added:", newFriend);
    setIsModalOpen(false);
    setNewFriend({ name: "", status: "inactive" });
  };

  return (
    <div className="container">
      <div style={{ display: "flex" }}>
        <h2>
          My Friends
          <FaUserPlus
            style={{
              fontSize: "24px",
              cursor: "pointer",
              marginLeft: "10px",
              color: "#62C370",
            }}
            onClick={() => setIsModalOpen(true)}
          />
        </h2>
      </div>
      <div className="friends-container">
        <div className="friends-selector">
          <p
            className={`tab ${activeTab === "friends" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </p>
          <p
            className={`tab ${activeTab === "requests" ? "active-tab" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
          </p>
        </div>
        <div className="friends-content">
          {activeTab === "friends" &&
            mockedUsers.map((user) => (
              <div key={user.id} className={`friend ${user.status}`}>
                <img src={profilePicture} alt={user.name} />
                <div className="friend-info">
                  <h3>{user.name}</h3>
                  <p>{user.status}</p>
                </div>
              </div>
            ))}
          {activeTab === "requests" &&
            mockedUsers.map((request) => (
              <div key={request.id} className="request">
                <img src={profilePicture} alt={request.name} />
                <div className="request-info">
                  <h3>{request.name}</h3>
                  <div className="request-actions">
                    <button className="accept">Accept</button>
                    <button className="decline">Decline</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Friend</h2>
            <input
              type="text"
              placeholder="Enter friend's name"
              value={newFriend.name}
              onChange={(e) =>
                setNewFriend({ ...newFriend, name: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={handleAddFriend} className="accept">
                Add Friend
              </button>
              <button onClick={() => setIsModalOpen(false)} className="decline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
