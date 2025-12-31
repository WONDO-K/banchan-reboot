import React,{useState,useEffect} from "react";
import Header from "../../Header";
import { useParams} from "react-router-dom";
import { useCookies } from "react-cookie";
import { getCommunityDetails } from "../../../mobileapi/CommunityAPI";
const AskDetail: React.FC = () => {

  const { id } = useParams();
  const [post, setPost] = useState({
    title:'Ask',
    content:'',
    createdAt:'',
    id:'',
    files:[],
  });
  const [cookies] = useCookies(['Token']);
  
  useEffect(() => {
    const fetchPostDetail = async () => {
      const data = await getCommunityDetails(cookies.Token,`api/ask/detail/${id}`);
      setPost({
        content : data.content,
        title : data.title,
        createdAt : data.createdAt.slice(0,10),
        id : data.id,
        files : data.files,
      });
    };

    fetchPostDetail();
  }, [id, cookies.Token]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Header>건의함</Header>
      <div className="max-w-md mx-2 p-6 bg-white border rounded-lg my-2 ">
        <h1 className="text-xl font-bold mb-2 mt-4">{post.title}</h1>
        <p className="text-gray-500 mb-4">{post.createdAt}</p>

        <div className="border-b-4 border-black mb-4"></div>
        <div className=" min-h-[250px]">

            <p className="mb-6">
              {post.content}
            </p>
        </div>

        <div className="border-b-2 border-black mb-4"></div>

      </div>
    </div>
  );
};

export default AskDetail;
