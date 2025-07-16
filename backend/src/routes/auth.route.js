import { Router } from "express";
// import { authCallback } from "../controller/auth.controller";

const router = Router();

// router.post("/callback", authCallback);
router.get("/",(req,res)=>{
    res.send("Auth route with GET method");
});


export default router;