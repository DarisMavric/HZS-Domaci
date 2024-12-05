import React, { useContext, useState } from "react";
import "./Friends.css";
import profilePicture from "../../assets/profile.png";
import { FaUserPlus } from "react-icons/fa";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

  const acceptRequest = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "http://localhost:8080/api/friends/acceptRequest",
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["friends"]),
    onError: (error) => console.error("Failed to accept request:", error),
  });
  
  const declineRequest = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "http://localhost:8080/api/friends/declineRequest",
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["friends"]),
    onError: (error) => console.error("Failed to decline request:", error),
  });

  const addFriend = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        "http://localhost:8080/api/friends/addFriend",
        data,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries(["friends"]),
    onError: (error) => console.error("Failed to send request:", error),
  });


  if (isLoading) {
    return <div>Loading quizzes...</div>;
  }

  const accept = (friendId) => {
    if (!currentUser) return console.error("User not logged in");
    acceptRequest.mutate({ userId: currentUser?._id, requestId: friendId });
  };
  
  const decline = (friendId) => {
    if (!currentUser) return console.error("User not logged in");
    declineRequest.mutate({ userId: currentUser?._id, requestId: friendId });
  };

  const handleAddFriend = async() => {
    setIsModalOpen(false);
    setNewFriend({ name: "" });
    if (!currentUser) return console.error("User not logged in");
    addFriend.mutate({ userId: currentUser?._id, friendName: newFriend });
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
                <img src={profilePicture} alt={user.username} />
                <div className="friend-info">
                  <h3>{user.username}</h3>
                  <p>friends</p>
                </div>
              </div>
            ))}
          {activeTab === "requests" &&
            data?.filter((request) => request.status === "pending" && request.friendId === currentUser?._id)
            .map((request) => (
              <div key={request.id} className="request">
                <img src={profilePicture} alt={request.username} />
                <div className="request-info">
                  <h3>{request.username}</h3>
                  <div className="request-actions">
                    <button className="accept" onClick={() => accept(request.userId)}>Accept</button>
                    <button className="decline" onClick={() => decline(request.userId)}>Decline</button>
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
