import  express  from "express";
import {addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator} from '../controllers/educatorController.js';
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";
import {requireAuth} from "@clerk/express"

const educatorRouter=express.Router()

educatorRouter.get('/update-role',requireAuth(),updateRoleToEducator)
educatorRouter.post('/add-course',upload.single('image'),requireAuth(),protectEducator,addCourse)
educatorRouter.get('/courses',protectEducator,getEducatorCourses)
educatorRouter.get('/dashboard',protectEducator,educatorDashboardData)
educatorRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)


export default educatorRouter; 