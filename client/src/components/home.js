import { React, useState, useEffect, useCallback } from "react";
// import data from "./data";
import axios from "axios";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { EffectFlip } from "swiper";
import icon from "../images/heart.svg";
import iconfill from "../images/heart-fill.svg";
import image from "../images/user.svg";
import SuprSendInbox from "@suprsend/react-inbox";
import { Swiper, SwiperSlide } from "swiper/react";
//swiper stylesheets
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/navigation";
import "swiper/css/pagination";
import AddPost from "./addpost";

function Home({ username, email, phone }) {
  const [postnum, setPostNum] = useState();
  // const [isIcon, setIsIcon] = useState([true, true, true]);
  const [subid, setsubid] = useState();
  const [showAddPostModal, setShowAddPostModal] = useState(false);

  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://multiii.onrender.com/posts");
      const updatedPosts = response.data.map((post) => ({
        ...post,
        isLiked: false,
      }));
      setPosts(updatedPosts);
      // console.log(response.data);
    } catch (error) {
      console.error("An error occurred while fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const getSub = async () => {
      const response = await axios.get("https://multiii.onrender.com/subid", {
        params: {
          email: email,
        },
      });
      return response;
    };
    setsubid(getSub());
  }, [email]);

  // const sendNotif = useCallback(async () => {
  //   try {
  //     const response = await axios.post("https://multiii.onrender.com/like", {
  //       username: username,
  //       email: email,
  //       phone: phone,
  //       postnum: postnum,
  //     });
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("An error occurred while sending notification:", error);
  //   }
  // }, [username, email, phone, postnum]); // include all variables that the function depends on

  // useEffect(() => {
  //   console.log(postnum);
  //   if (postnum !== undefined) sendNotif();
  // }, [postnum, sendNotif]);

  return (
    <>
      {showAddPostModal && (
        <AddPost
          showAddPostModal={showAddPostModal}
          setShowAddPostModal={setShowAddPostModal}
          fetchPosts={fetchPosts}
        />
      )}
      <div style={{ width: "98.9vw", height: "100vh" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#222",
            color: "#fff",
            width: "100%",
            marginBottom: "70px",
            padding: "20px 10px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h2 style={{ fontSize: "35px" }}>Insta-Kilo-Gram</h2>
          <div
            style={{
              position: "fixed",
              right: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div>
              <button
                className="button"
                onClick={() => setShowAddPostModal(true)}
                style={{ marginRight: "15px" }}
              >
                NewPost
              </button>
            </div>

            <SuprSendInbox
              theme={{
                bell: { color: "white" },
              }}
              workspaceKey="Wct0hLNKo5NXA05QiOdU"
              workspaceSecret="Y2XOv3V0pXRbioyiWH7u"
              subscriberId={subid}
              distinctId={email}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "10px",
          }}
        >
          <div style={{ width: "20%" }}>
            <Swiper
              modules={[Navigation, Pagination, Scrollbar, A11y, EffectFlip]}
              effect={"flip"}
              //   navigation={true}
              pagination={{ clickable: true }}
            >
              {posts.map((item, index) => (
                <SwiperSlide
                  key={index}
                  style={{
                    borderRadius: "12px",
                    border: "1px solid grey",
                    height: "65vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: "white",
                  }}
                >
                  <div
                    className="head"
                    style={{
                      display: "flex",
                      margin: "10px",
                      marginLeft: "30px",
                      fontSize: "18px",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <img
                      style={{
                        marginRight: "7px",
                        cursor: "pointer",
                        borderRadius: "50%",
                        width: "25px",
                        height: "25px",
                      }}
                      src={image}
                      alt={item.contributor}
                      title={item.contributor}
                    />
                    {item.contributor}
                  </div>
                  <div
                    className="image"
                    style={{
                      width: "100%",
                      height: "45%",
                      borderTop: "2px solid #80808052",
                      borderBottom: "2px solid #80808052",
                    }}
                  >
                    <img
                      // src={`images/${item.filename}`}
                      src={`https://multiii.onrender.com/images/${item.image}`}
                      alt="image1"
                      style={{
                        objectFit: "cover",
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  </div>
                  <div
                    className="action-center"
                    style={{
                      fontSize: "18px",
                      width: "100%",
                      margin: "10px",
                      marginLeft: "30px",
                    }}
                  >
                    <img
                      src={posts[index].isLiked ? iconfill : icon}
                      alt="like"
                      style={{
                        cursor: "pointer",
                        height: "20px",
                        width: "20px",
                      }}
                      // onClick={async () => {
                      //   const newIsIcon = [...isIcon];
                      //   newIsIcon[index] = !newIsIcon[index];
                      //   if (isIcon[index]) {
                      //     setPostNum(index);
                      //     // sendNotif();
                      //   }
                      //   setIsIcon(newIsIcon);
                      // }}
                      onClick={async () => {
                        const newPosts = [...posts];
                        newPosts[index].isLiked = !newPosts[index].isLiked;

                        if (newPosts[index].isLiked) {
                          setPostNum(index);
                          try {
                            await axios.post(
                              `https://multiii.onrender.com/posts/${posts[index]._id}/like`,
                              {
                                userId: email,
                              }
                            );
                          } catch (error) {
                            console.error(
                              "An error occurred while liking the post:",
                              error
                            );
                          }
                        }
                        setPosts(newPosts);
                      }}
                    />
                  </div>
                  <div
                    className="body"
                    style={{
                      width: "95%",
                      height: "33%",
                      margin: "0 10px",
                      overflowY: "auto",
                      marginBottom: "20px",
                    }}
                  >
                    <span>
                      <strong>{item.contributor} : &nbsp; </strong>
                    </span>
                    {item.body}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
