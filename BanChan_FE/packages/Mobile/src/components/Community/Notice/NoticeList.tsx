import React,{useEffect,useState} from "react";
import Header from "../../Header";
import { useNavigate } from "react-router-dom";
import { getCommunityList } from "../../../mobileapi/CommunityAPI";
import { useCookies } from "react-cookie";
import { CommunityListType,CommunityParamsType } from "../../../Types";
import Pagination from "../../Pagination";

const NoticeList: React.FC = () => {
  const navigate = useNavigate();
  const [totalitem,setTotal] = useState(0)
  const [totalPages, setTotalPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [keywords, setKeywords] = useState('')
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
    size:5
  })

  useEffect(() => {
    setParams((prevParams) => ({
      ...prevParams,
      page: currentPage - 1,
      keyword: keywords,
    }));
  }, [currentPage,keywords]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [cookies] = useCookies()
  useEffect(() => {
    const getData = async () => {
      const askList = await getCommunityList(cookies.Token,'api/notice/list',params);
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


  const goToDetail = (id:number) => {
    navigate(`/m/community/notice/detail/${id}`);
  };

  const onInputHandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
    setKeywords(e.target.value)
  }
  return (
    <div className="min-h-screen">
      <Header>공지사항</Header>
      <div className="max-w-md mx-auto p-4 mt-5">
        <div className="flex justify-start items-center mb-4">
          <div className="text-gray-500 mr-2">
            <i className="fas fa-bell"></i>
          </div>
          <div className="text-gray-500">총 {totalitem}건의 공지사항이 있습니다.</div>
        </div>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="검색"
            className="w-full border rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onInput={onInputHandler}
          />
          <i className="fas fa-search absolute top-3 left-3 text-gray-400"></i>
        </div>
        <div className="border-b-4 border-black"></div>

        <div>
          {notifications.map((item) => (
            <div key={item.id} className="border-b py-2">
              <div className="flex flex-col justify-between items-start">
                <div onClick={() => goToDetail(item.id)} className="font-semibold text-lg">
                  <span className="text-blue-500">[공지] </span>
                  {item.title}
                </div>
                <div className="text-gray-500 text-sm">{item.date}</div>
              </div>
              <div className="text-gray-500 text-sm flex items-center mt-1">
                <i className="fas fa-eye mr-2"></i>
                {item.views}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-between mt-3">


          {/* 페이징처리 코드 알아서 넣으면 됨 !  */}
          
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange}></Pagination>
        </div>
      </div>
    </div>
  );
};

export default NoticeList;
