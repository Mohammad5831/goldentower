import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const IndexBrandsPage = () => {
    const navigate = useNavigate();
    const { brand } = useParams();

    if (brand === 'vita') {
        navigate('/brands/vita')
    } else if (brand === 'datees') {
        navigate('/brands/datees')
    } else if (brand === 'badab') {
        navigate('/brands/badab')
    } else if (brand === 'artin') {
        navigate('/brands/artin')
    }
};

export default IndexBrandsPage;