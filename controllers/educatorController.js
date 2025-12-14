import {clerkClient, getAuth} from '@clerk/express'
import {v2 as cloudinary} from 'cloudinary'
import Course from '../models/Course.js' 
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'

export const updateRoleToEducator=async (req,res)=>{
    try{
        const userId=getAuth(req).userId
        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata:{
                role:'educator',
            }
        })
        res.json({success:true,message:"You can publish a course now"});
    } catch(error){
        res.json({success:false,message:error.message})
    }
}

// ADD NEW COURSE

export const addCourse = async(req,res)=>{
    try{
        const {courseData}=req.body
        const imageFile=req.file 
        const educatorId=getAuth(req).userId

        if(!imageFile){
            return res.json({success:false,message:'Thumbnail Not Attached'})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator=educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail=imageUpload.secure_url
        await newCourse.save()

        res.json({success:true,message:'Course Added'})
    } catch(error){
        res.json({success:false,message:error.message})
    }
}

//Get Educator Courses
export const getEducatorCourses=async(req,res)=>{
    try{
        const educator=getAuth(req).userId
        const courses=await Course.find({educator})
        res.json({success:true,courses})
    } catch(error){
        res.json({success:false,message:error.message})
    }
}

// get educatore dashboard data (ttal earnings, enrolled students, No. of courses)

export const educatorDashboardData = async(req,res) =>{
    try {
        const educator = getAuth(req).userId

        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id)
        // calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings =Math.round( purchases.reduce((sum, purchase) => sum + purchase.amount, 0)).toFixed(2)
        
        // collect unique enrolled students ids with their course title

        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl')

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }
        res.json({success: true, dashboardData: {
            totalEarnings,enrolledStudentsData, totalCourses
        }})
    } catch (error) {
        res.json({success: false, message:error.message})    
    }
}

// Get Enrolled Students Data with purchase data

export const getEnrolledStudentsData = async(req,res) =>{
    console.log(req);
    try {
        const educator = getAuth(req).userId;
        const courses = await Course.find({educator})
        const courseIds = courses.map(course => course._id)

        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({success: true, enrolledStudents});

    } catch (error) {
        res.json({success: false, message:error.message})
    }
}
