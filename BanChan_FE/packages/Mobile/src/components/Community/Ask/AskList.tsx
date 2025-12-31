import React,{useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";

import { getCommunityList } from "../../../mobileapi/CommunityAPI";
import { useCookies } from "react-cookie";
import { CommunityListType,CommunityParamsType } from "../../../Types";
import Pagination from "../../Pagination";



const AskList: React.FC = () => {
  const [totalitem,setTotal] = useState(0)
  const [totalPages, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [notifications,setData] = useState([{
    id:-1,
    title:'존재하는 데이터가 없습니다.',
    date:'0000-00-00',
    views:-1
  }])
  const [params,setParams] = useState<CommunityParamsType>({
    keyword:'',
    sortBy:'createdAt',
    sortDirection:'desc',
    page:0,
    size:6
  })
  useEffect(() => {
    setParams((prevParams) => ({
      ...prevParams,
      page: currentPage - 1,
    }));
  }, [currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [cookies] = useCookies()
  useEffect(() => {
    const getData = async () => {
      const askList = await getCommunityList(cookies.Token,'api/ask/list',params);
      setTotal(askList.totalElements)
      setTotalPage(askList.totalPages)
      const real_data = askList.content.map((item:CommunityListType) => ({
        id: item.id,
        title: item.title,
        writer: item.username,
        date: item.createdAt.replace("T", " ").slice(0, 10),
        views: item.views
      }));
      setData(real_data)
    };
    getData();
  }, [params,cookies.Token]);

  const navigate = useNavigate();

  const goToDetail = (id:number) => {
    navigate(`/m/community/ask/detail/${id}`);
  };

  const goToWrite = () => {
    navigate("/m/community/ask/write");
  };

  return (
    <div className="min-h-screen">
      <Header>건의함</Header>
      <div className="max-w-md mx-auto p-4 mt-5">
        <div className="flex justify-start items-center mb-4">
          <div className="text-gray-500 mr-2">
            <i className="fas fa-bell"></i>
          </div>
          <div className="text-gray-500">총 {totalitem}건의 건의를 하셨습니다.</div>
        </div>
        <div className="relative mb-4 flex justify-end">
          <button
            onClick={goToWrite}
            className="py-2 px-4 bg-blue-500 rounded-xl"
          >
            글 쓰기
          </button>
        </div>
        <div className="border-b-4 border-black"></div>

        <div>
          {notifications.map((item) => (
            <div key={item.id} className="border-b py-3">
              <div className="flex flex-col justify-between items-start">
                <div onClick={() => goToDetail(item.id)} className="font-semibold text-lg">
                  {item.title}
                </div>
                <div className="text-gray-500 text-sm">{item.date}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between mt-3">

        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}></Pagination>

        </div>
      </div>
    </div>
  );
};

export default AskList;
