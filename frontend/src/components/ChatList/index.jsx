import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import AllChatsIcon from "../../assets/icons/AllChatsIcon";
import DraftMessagesIcon from "../../assets/icons/DraftMessagesIcon";
import ArchiveIcon from "../../assets/icons/ArchiveIcon";
import UnreadMessageIcon from "../../assets/icons/UnreadMessageIcon";
import ClassicSpinner from "../loader/ClassicSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import FilterIcon from "../../assets/icons/FilterIcon";
import SearchIcon from "../../assets/icons/SearchIcon";
import StarIcon from "../../assets/icons/StarIcon";

const ChatList = ({
    openDraft,
    setOpenDraft,
    draftMessages,
    setOpenUnReadGroups,
    handleSearch,
    setOpenStarChat,
    chatMessage,
    hasMoreData,
    fetchMoreChats,
    groups,
    groupChatRoom,
    setGroupChatRoom,
    unReadGroups,
    openUnReadGroups,
    userList,
    checkAndCreateChat,
    chatRoom,
    handleGroupOpen,
    handleSelectedMenu,
    setOpenGroupMenu,
    getTimeAgo
}) => {
  return (
    <div className=" relative bg-[#FFFFFF] w-full h-full rounded-3xl border border-[#D7D7D8] ">
      <div className="flex relative  items-center justify-between font-semibold text-lg border-b border-[#D7D7D8] py-[16px] px-[24px] ">
        <p>My Chats</p>
        <div className="  ">
          <Menu>
            <MenuButton>
              <FilterIcon/>
            </MenuButton>
            <MenuItems anchor="bottom ">
              <div className=" cursor-pointer bg-white w-[200px] flex flex-col justify-center rounded-3xl border border-[#D7D7D8] rounded-tr-[2px]  ">
                <MenuItem>
                  <div
                    className="flex  data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px]  hover:rounded-tl-2xl  "
                    onClick={() => {
                      setOpenDraft(false);
                      setOpenUnReadGroups(false);
                    }}
                  >
                    <AllChatsIcon />
                    All Chats
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] border-y border-[#D7D7D8] "
                    onClick={() => setOpenUnReadGroups(true)}
                  >
                    <UnreadMessageIcon />
                    Unread Chats
                  </div>
                </MenuItem>
                <MenuItem>
                  <div className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] border-b border-[#D7D7D8] border-t-0  ">
                    <ArchiveIcon />
                    Archived Chats
                  </div>
                </MenuItem>
                <MenuItem>
                  <div
                    className="flex data-[focus]:bg-blue-100 gap-[12px] p-[16px] pr-[24px] hover:rounded-b-2xl    "
                    onClick={() => setOpenDraft(true)}
                  >
                    <DraftMessagesIcon />
                    Drafts
                  </div>
                </MenuItem>
              </div>
            </MenuItems>
          </Menu>
        </div>
      </div>
      <div className="flex p-[24px] pb-0 items-center gap-[16px] ">
        <div className="outline-none flex gap-[12px] w-full border border-[#D7D7D8] py-[10px] px-[12px] bg-[#F2F3F5] rounded-xl">
          <SearchIcon />
          <input
            placeholder="Search users"
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-[#F2F3F5] outline-none "
          />
        </div>
        <span
          onClick={() => {
            setOpenStarChat(true);
          }}
        >
          <StarIcon />
        </span>
      </div>
      <InfiniteScroll
        dataLength={chatMessage?.length || 0}
        next={fetchMoreChats}
        hasMore={hasMoreData}
        style={{
          display: "flex",
          flexDirection: "column", // Ensure items are in reverse order
          overflowY: "auto", // Enable vertical scrolling,
          paddingTop: "0px",
          padding: "16px",
          position: "relative",
        }}
        loader={
          <div className=" w-full h-[40px] bg-red-950 ">
            <ClassicSpinner />
          </div>
        }
        scrollableTarget="scrollableDiv"
        className=" "
        height={"60vh"}
      >
        {groups &&
          !openUnReadGroups &&
          !openDraft &&
          userList &&
          userList.length > 0 && (
            <div className="text-black flex flex-col absolute bg-white  border border-[#D7D7D8] w-[400px] rounded-xl">
              {userList.map((user, index) => (
                <div
                  key={index}
                  className="border-b py-[12px] px-[16px] last:border-none border-[#D7D7D8] flex gap-[16px] hover:bg-slate-400 transition"
                  onClick={() => checkAndCreateChat(user)}
                >
                  <img
                    src={user?.pic}
                    className="w-[24px] h-[24px] rounded-full"
                  />
                  <p>{user?.username}</p>
                </div>
              ))}
            </div>
          )}

        {chatRoom && (
          <div>
            {chatRoom.map((group, index) => {
              console.log(group, "mouse");
              return (
                <div key={index}>
                  <p
                    className={` ${
                      groupChatRoom?._id == group?._id && "bg-[#E8EFFA] "
                    } cursor-pointer p-[12px] rounded-xl flex gap-[12px] `}
                    onClick={() => {
                      handleGroupOpen(group);
                      handleSelectedMenu("about");
                      setOpenGroupMenu(false);
                    }}
                  >
                    <img
                      src={group?.users[1]?.pic}
                      className=" w-[48px] h-[48px] rounded-full "
                    />
                    <div className=" w-full ">
                      <div className=" flex justify-between w-full items-center ">
                        <p className=" font-medium text-base text-[#16171C] ">
                          {group?.users[1]?.username}
                        </p>
                        <p className=" text-[#949497] text-[12px] leading-[18px] ">
                          {getTimeAgo(group?.latestMessage?.createdAt)}
                        </p>
                      </div>
                      <div className=" flex w-full justify-between ">
                        <p className=" text-[#57585C] ">
                          {draftMessages && draftMessages[group?._id] ? (
                            <p>
                              <span className=" text-[#1660CD] font-medium  ">
                                Draft:
                              </span>{" "}
                              {draftMessages[group?._id]?.draftMessage}
                            </p>
                          ) : group?.latestMessage?.content?.length > 25 ? (
                            group?.latestMessage?.content.substring(0, 25) +
                            `...`
                          ) : (
                            group?.latestMessage?.content ??
                            "Start a converstion"
                          )}
                        </p>
                        {(group.unSeenMessages || []).map((unSeenMessage) => {
                          const loggedInUserId = JSON.parse(
                            localStorage.getItem("user")
                          )._id; // Get logged-in user ID

                          // Check if the user ID matches the logged-in user
                          if (
                            unSeenMessage.user === loggedInUserId &&
                            unSeenMessage.count > 0
                          ) {
                            return (
                              <div
                                key={unSeenMessage.user}
                                className="bg-[#1660CD] text-[10px] text-white rounded-lg py-[6px] px-[8px] max-h-[20px] max-w-[22px] flex items-center"
                              >
                                {unSeenMessage.count}{" "}
                                {/* Display the unseen message count */}
                              </div>
                            );
                          }

                          return null; // Return null if the user does not match or count is 0
                        })}
                      </div>
                    </div>
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {openDraft &&
          Object.values(draftMessages).map((group, index) => {
            return (
              <div key={index}>
                <p
                  className="hover:bg-orange-400 cursor-pointer p-2 rounded-md flex gap-[12px]"
                  onClick={() => {
                    setGroupChatRoom(group.groupChatRoom);
                    setOpenStarChat(false);
                  }}
                >
                  <img
                    src={group.groupChatRoom.groupAdmin?.pic}
                    className="w-[48px] h-[48px] rounded-full"
                  />
                  <div>
                    <p>{group?.groupChatRoom.users[1]?.username}</p>
                    <p>
                      {draftMessages[group.groupChatRoom?._id]
                        ? `Draft: ${
                            draftMessages[group.groupChatRoom?._id]
                              ?.draftMessage
                          }`
                        : group.groupChatRoom.latestMessage?.content}
                    </p>
                  </div>
                </p>
              </div>
            );
          })}
        {openUnReadGroups &&
          unReadGroups.map((group, index) => {
            console.log("copy", group);
            return (
              <div key={index}>
                <p
                  className={` ${
                    groupChatRoom?._id == group?._id && "bg-[#E8EFFA] "
                  } cursor-pointer p-[12px] rounded-xl flex gap-[12px] `}
                  onClick={() => {
                    handleGroupOpen(group);
                    handleSelectedMenu("about");
                    setOpenGroupMenu(false);
                  }}
                >
                  <img
                    src={group.groupAdmin?.pic}
                    className=" w-[48px] h-[48px] rounded-full "
                  />
                  <div className=" w-full ">
                    <div className=" flex justify-between w-full items-center ">
                      <p className=" font-medium text-base text-[#16171C] ">
                        {group?.users[1]?.username}
                      </p>
                      <p className=" text-[#949497] text-[12px] leading-[18px] ">
                        {getTimeAgo(group?.latestMessage?.createdAt)}
                      </p>
                    </div>
                    <div className=" flex w-full justify-between ">
                      <p className=" text-[#57585C] ">
                        {draftMessages && draftMessages[group?._id] ? (
                          <p>
                            <span className=" text-[#1660CD] font-medium  ">
                              Draft:
                            </span>{" "}
                            {draftMessages[group?._id]?.draftMessage}
                          </p>
                        ) : group?.latestMessage?.content?.length > 25 ? (
                          group?.latestMessage?.content.substring(0, 25) + `...`
                        ) : (
                          group?.latestMessage?.content ?? "Start a converstion"
                        )}
                      </p>
                      {(group.unSeenMessages || []).map((unSeenMessage) => {
                        const loggedInUserId = JSON.parse(
                          localStorage.getItem("user")
                        )._id; // Get logged-in user ID

                        // Check if the user ID matches the logged-in user
                        if (
                          unSeenMessage.user === loggedInUserId &&
                          unSeenMessage.count > 0
                        ) {
                          return (
                            <div
                              key={unSeenMessage.user}
                              className="bg-[#1660CD] text-[10px] text-white rounded-lg py-[6px] px-[8px] max-h-[20px] max-w-[22px] flex items-center"
                            >
                              {unSeenMessage.count}{" "}
                              {/* Display the unseen message count */}
                            </div>
                          );
                        }

                        return null; // Return null if the user does not match or count is 0
                      })}
                    </div>
                  </div>
                </p>
              </div>
            );
          })}
      </InfiniteScroll>
    </div>
  );
};

export default ChatList;
