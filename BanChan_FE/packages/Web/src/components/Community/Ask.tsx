import React, { useEffect, useState } from "react";
import Pagination from "../Pagination";
import Nav from "../Nav";
import NavItem from "../NavItem";
import { useCookies } from "react-cookie";
import TempTable from "../TempTable";
import { getCommunityList } from "../../api/CommunityAPI";
import { CommunityParamsType,CommunityListType,DataItem} from "../../Type";
const headers = ["id", "title", "writer", "createdAt", "views", "likes"];

// axios 요청 함수
const NavElements = () => {
  return (
    <Nav>
      <NavItem to="/community/notice" label="공지사항" />
      <NavItem to="/community/ask" label="건의함" />
    </Nav>
  );
};

const Ask: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [cookies] = useCookies();
  const [maxPage,setMaxPage] = useState<number>(1);
  const [crtPage,setCrtPage] = useState<number>(1);

  const [params,setParams] = useState<CommunityParamsType>({
    keyword:'',
    sortBy:'createdAt',
    sortDirection:'desc',
    page:0,
    size:10
  })

  useEffect(() => {
    const getData = async () => {
      const askList = await getCommunityList(cookies.Token,'api/ask/list',params);
      setMaxPage(askList.totalPages)
      const real_data = askList.content.map((item:CommunityListType) => ({
        id: item.id,
        title: item.title,
        writer: item.username,
        createdAt: item.createdAt.replace("T", " ").slice(0, 10),
        views: item.views,
        likes: item.likes,
      }));
      setData(real_data);
    };
    getData();
  }, [params,cookies.Token]);


  useEffect(() => {
    setParams((prevParams) => ({
      ...prevParams,
      page: crtPage - 1,
    }));
  }, [crtPage]);
  
  const handlePageChange = (page: number) => {
    setCrtPage(page);
  };

  return (
    <>
      <NavElements />
      <div className="container mx-auto p-4 mt-3">
        <div className="flex justify-end items-center mb-6 mr-6">
        </div>
        <TempTable headerProp={headers} data={data} />
        <Pagination maxPage={maxPage} currentPage={crtPage} onPageChange={handlePageChange} />
      </div>
    </>
  );
};

export default Ask;
