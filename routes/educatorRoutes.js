import  express  from "express";
import {addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator} from '../controllers/educatorController.js';
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import {requireAuth} from "@clerk/express"

const educatorRouter=express.Router()

educatorRouter.get('/update-role',requireAuth(),updateRoleToEducator)
educatorRouter.post('/add-course',upload.single('image'),requireAuth(),protectEducator,addCourse)
educatorRouter.get('/courses',requireAuth(),protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',requireAuth(),protectEducator,educatorDashboardData)
educatorRouter.get('/enrolled-students',requireAuth(),protectEducator,getEnrolledStudentsData)


export default educatorRouter; 