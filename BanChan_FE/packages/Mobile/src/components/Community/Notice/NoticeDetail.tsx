import React,{useState,useEffect} from "react";
import Header from "../../Header";
import { useParams} from "react-router-dom";
import { useCookies } from "react-cookie";
import { getCommunityDetails } from "../../../mobileapi/CommunityAPI";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const NoticeDetail: React.FC = () => {

  interface File {
    id: number;
    originalFilename: string;
  }
  interface Post {
    title: string;
    content: string;
    createdAt: string;
    id: number;
    files: File[];
  }
  const { id } = useParams();
  const [post, setPost] = useState<Post>({
    title:'Notice',
    content:'',
    createdAt:'',
    id:0,
    files:[],
  });
  const [cookies] = useCookies(['Token']);
  

  const downloadHandler = (fileid:number) => {
    const download = async () => {
      const response = await axios.get(`${API_URL}/api/notice/download/${fileid}`,{
        headers : {
          Authorization: `Bearer ${cookies.Token}`, // Use response data here
        },
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${post?.files[0].originalFilename}`);  // 파일명 설정
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      return response
    }
    download()
  }

  useEffect(() => {
    const fetchPostDetail = async () => {
      const data = await getCommunityDetails(cookies.Token,`api/notice/detail/${id}`);
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
      <Header>공지사항</Header>
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

        <div className="text-gray-600 mb-4">
          <p className="font-semibold text-gray-300">첨부파일</p>
          <p className="text-blue-500 underline">
            <button
            onClick={() => downloadHandler(post.files[0]?.id)}>
                {post.files[0]?.originalFilename}
              </button></p>
        </div>
        <div className="border-b-2 border-black"></div>
      </div>
    </div>
  );
};

export default NoticeDetail;
