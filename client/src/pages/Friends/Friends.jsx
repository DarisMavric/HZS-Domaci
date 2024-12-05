import React, { useContext, useState } from "react";
import "./Friends.css";
import profilePicture from "../../assets/profile.png";
import { FaUserPlus } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Friends = () => {
  const [activeTab, setActiveTab] = useState("friends");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFriend, setNewFriend] = useState(null);

  const {currentUser} = useContext(AuthContext);

  const queryClient = useQueryClient();
    
  const {data,isLoading} = useQuery({
      queryFn: async() => await axios.post('http://localhost:8080/api/friends/getFriends', { userId: currentUser?._id }).then(res => {return res.data}),
      queryKey: ["friends"],
  });

  if (isLoading) {
    return <div>Loading quizzes...</div>;
  }

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

  const handleAddFriend = async() => {
    setIsModalOpen(false);
    setNewFriend({ name: "" });
    try {
      const response = await axios.post('http://localhost:8080/api/friends/addFriend', {
        userId: currentUser?._id,
        friendName: newFriend
      });
      return response.data;
    } catch (error) {
      console.error("Error sending friend request:", error);
      throw error;
    }
  };

  const accept = async (friendId) => {
    console.log(friendId);
    try {
      const response = await axios.post('http://localhost:8080/api/friends/acceptRequest', {
        userId: currentUser?._id,
        requestId: friendId
      });
      return response.data;
    } catch (error) {
      console.error("Error accepting friend request:", error);
      throw error; // Re-throw the error if you want to handle it elsewhere
    }
  };

  const decline = (friendId) => {
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
            data?.filter((request) => request.status === "accepted")
            .map((user) => (
              <div key={user.id} className={`friend ${user.status}`}>
                <img src={profilePicture} alt={user.name} />
                <div className="friend-info">
                  <h3>{user.friendName}</h3>
                  <p>friends</p>
                </div>
              </div>
            ))}
          {activeTab === "requests" &&
            data?.filter((request) => request.status === "pending")
            .map((request) => (
              <div key={request.id} className="request">
                <img src={profilePicture} alt={request.friendName} />
                <div className="request-info">
                  <h3>{request.friendName}</h3>
                  <div className="request-actions">
                    <button className="accept" onClick={() => accept(request.friendId)}>Accept</button>
                    <button className="decline" onClick={() => decline(request.friendId)}>Decline</button>
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
              onChange={(e) =>
                setNewFriend( e.target.value )
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
