import {pool} from '../config/db.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'
import { calculateDistance } from '../utils/calculateDistance.js'


export const addSchool = async(req,res,next)=> {
    const {name, address, latitude, longitude} = req.body;
        if(!name || !address || latitude === undefined || longitude === undefined) {
            return next(new ApiError(400, "All fields are required"));
        }

        if(typeof name !== 'string' || name.trim() == '') {
            return next(new ApiError(400, "Invalid name"));
        }

        if(typeof address !== 'string' || address.trim() == '') {
            return next(new ApiError(400, "Invalid address"));
        }

        if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return next(new ApiError(400, "Invalid coordinates"));
        }
    

    try {
        const [result] = await pool.query('INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)])
        
        return res.status(201).json(new ApiResponse(true, "School added successfully", {}));    
    } catch (error) {
        console.error(error);
        next(error);
    }
}


export const listSchools = async(req,res,next)=> {
    const {latitude, longitude} = req.query;
        
    if (latitude === undefined || longitude === undefined) {
        return next(new ApiError(400, "User coordinates are required"))
        
    }

     const userLatitude = parseFloat(latitude);
     const userLongitude = parseFloat(longitude);

     if (isNaN(userLatitude) || isNaN(userLongitude) || userLatitude < -90 || userLongitude > 90 || userLatitude < -180 || userLongitude > 180) {
        return next(new ApiError(400, "Invalid user coordinates"))
    }

    try {
        const [schools] = await pool.query('SELECT * FROM schools');
    
        const schoolsWithDistance = schools.map(school => ({
            ...school,
            distance: calculateDistance(userLatitude, userLongitude, school.latitude, school.longitude)
        })).sort((a, b) => a.distance - b.distance);

        return res.status(200).json(new ApiResponse(true, "Schools fetched successfully", {schools:schoolsWithDistance}))
        
    } catch (error) {
        console.error(error);
        next(error);
    }
}