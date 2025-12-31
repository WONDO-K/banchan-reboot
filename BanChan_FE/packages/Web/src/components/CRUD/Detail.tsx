import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate} from "react-router-dom";
import SmallButton from "../Buttons/SmallButton";
import { Post,UpdateProps } from "../../Type";
import { useCookies } from "react-cookie";
import { simpleDelete } from "../../api/simpleAPI";
const baseUrl = import.meta.env.VITE_API_URL;

type Params = {
  boardType: string;
  id: string;
};

const Detail: React.FC = () => {
  const { boardType, id } = useParams<Params>();
  const [post, setPost] = useState<Post | null>(null);
  const [cookies] = useCookies(['Token']);
  const navigate = useNavigate()

  const downloadHandler = (fileid:number) => {
    const download = async () => {
      const response = await axios.get(`${baseUrl}/api/notice/download/${fileid}`,{
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

      // 사용 후 URL 객체 해제
      window.URL.revokeObjectURL(url);
      return response
    }
    download()
  }
  const DetailContent: React.FC<{ post: Post }> = ({ post }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-7xl h-[750px]">
        <div className="mt-[20px]">
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              제목
            </label>
            <div className="w-full h-[60px] px-3 py-2 border bg-customInputStyle border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200">
              {post.title}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              내용
            </label>
            <div className="w-full h-[350px] px-3 py-2 bg-customInputStyle border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200">
              {post.content}
            </div>
          </div>
          {boardType == 'notice' ? (
          <div className="mb-4">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              첨부 파일
            </label>
            <div
              className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
              onClick={() => downloadHandler(post.files[0]?.id)}
              >
              <button>
                {post.files[0]?.originalFilename}
              </button>
            </div>
          </div>
              ) : (
                <></>
              )}

          <div className="flex justify-end mt-[40px]">
            <div className="mr-3"></div>
            {post.writer ? 
            (
              <SmallButton
              title="수정"
              bgColor="bg-white"
              txtColor="text-customGreen"
              borderColor="border-customGreen"
              onClick={postEdit}
              />
            ):(<></>)}
            <div className="mr-3"></div>
            {
              post.writer||post.admin ?
              (
            <SmallButton
              title="삭제"
              bgColor="bg-white"
              txtColor="text-customRed"
              borderColor="border-customRed"
              onClick={postDelete}
            />
              ):
              (
              <>
              </>
              )
            }
            
          </div>
        </div>
      </div>
    );
  };

  const postDelete = () => {
    const selection = confirm('게시글을 정말 삭제하시겠습니까?')
    if (selection) {
      simpleDelete(cookies.Token,`api/${boardType}/delete/${id}`)
      .then( () => {
        alert('게시글이 삭제되었습니다.')
        navigate(`/community/${boardType}`)
      }
      )
      
    }
  }

  const postEdit = () => {
    const data:UpdateProps = {
      title : post?.title??' ',
      content : post?.content ?? ' '
    }
    navigate(`/community/${boardType}/edit/${id}`,{state : {data}})
  }


  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const token = cookies.Token;
        if (!token) {
          console.error("토큰이 없습니다!");
          return;
        }
        const response = await axios.get(
          `${baseUrl}/api/${boardType}/detail/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setPost(response.data);
      } catch (error) {
        console.error("데이터를 가져오는 중 오류가 발생했습니다!", error);
      }
    };

    fetchPostDetail();
  }, [boardType, id, cookies.Token]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-customBackgroundColor p-4">
      <DetailContent post={post} />
    </div>
  );
};

export default Detail;
