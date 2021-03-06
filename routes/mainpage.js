const express = require("express");
const paginate = require('express-paginate');
const router = express.Router();
const data = require("../data");

const productsData = data.products;

router.get("/:page*?", async (req, res) => {
    res.locals.metaTags = {
        title: "Mainpage"
    }
    console.log(req.query)
    const page = req.query.page || 1
    // console.log(page, req.query.limit, req.skip)
    let offeredProducts, status, searchOn, totalPagesCount, searchCategory
    searchOn = req.query.searchOn ? String(req.query.searchOn) : undefined
    searchCategory = req.query.category ? String(req.query.category) : "All"
    if (!searchOn && searchCategory == "All") {
        offeredProducts = await productsData.getAllProducts(req.query.limit, req.skip)
        status = "offer all"
        console.log(`Returning all products`)
    } else if (searchOn && searchCategory == "All") {
        offeredProducts = await productsData.searchProductByName(searchOn, req.query.limit, req.skip)
        status = `offer ${searchOn}`
        console.log(`Returning products with name ${searchOn}`)
    } else if (!searchOn && searchCategory != "All") {
        offeredProducts = await productsData.searchProductByCategory(searchCategory, req.query.limit, req.skip)
        console.log(`Returning products with category ${searchCategory}`)
    } else {
        offeredProducts = await productsData.searchProductByNameAndCategory(searchOn, searchCategory, req.query.limit, req.skip)
        console.log(`Returning products with name ${searchOn} and category ${searchCategory}`)
    }

    totalPagesCount = Math.ceil(offeredProducts.listSize / req.query.limit)
    // console.log("------------------")
    // console.log(paginate.getArrayPages(req)(3, totalPagesCount, req.query.page))
    res.status(200).render("pages/mainpage", {
        pagination: {
            page: page,
            pageCount: totalPagesCount
        },
        products: offeredProducts.productList,
        status: status,
        category: searchCategory,
        searchOn: searchOn
    })
});

module.exports = router;