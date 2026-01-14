import React from "react";
import FilterBar from "./components/FilterBar";
import FollowupTable from "./components/FollowupTable";
import Pagination from "./components/Pagination";
import FollowUpHeader from "./components/FollowUpHeader";
import FollowUpTemp from "./components/FollowUpTemp";

const FollowupPage = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm">
            <FollowUpHeader />
            <FilterBar />
            <FollowupTable />
            <FollowUpTemp />
            <Pagination />
        </div>
    );
};

export default FollowupPage;
