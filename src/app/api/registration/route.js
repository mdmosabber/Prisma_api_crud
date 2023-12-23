import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";



//POST Insert Single Data
export async function POST(req, res){
    try {
        const reqBody = await req.json();
        const prisma = new PrismaClient();

        const age = parseInt(reqBody['age']);

        const result = await prisma.user.create({
            data: {
                firstName:  reqBody['firstName'],
                lastName:   reqBody['lastName'],
                age:        age,
                grade:      reqBody['grade'],
                courses: {
                    create: reqBody['courses'].map(courseName => ({ name: courseName }))
                }
            },
            include: { courses: true },        
        });

        return NextResponse.json({status: 'success', data: result})
        
    } catch (error) {   
        return NextResponse.json({status: "Fail", data: error.message})
    }
}




//Delete single data
export async function DELETE(req, res){
    try {
        const prisma = new PrismaClient();

        const {searchParams} = new URL(req.url);
        const id = parseInt(searchParams.get('id'));

        await prisma.course.deleteMany({
            where: { userID: id },
        });

        const result = await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({status: 'success', data: result})
        
    } catch (error) {
        return NextResponse.json({status: "Fail", data: error.message})
    }
}



//For Update
export async function PUT(req, res){
    try {

        const {searchParams} = new URL(req.url);
        const id = parseInt( searchParams.get('id') );

        const prisma = new PrismaClient();
        const reqBody = await req.json();

        const age = parseInt(reqBody['age']);

        const result = await prisma.user.update({
            where: {id: id},
            data: {
                firstName:  reqBody['firstName'],
                lastName:   reqBody['lastName'],
                age:        age,
                grade:      reqBody['grade'],
                courses: {
                    deleteMany: {},                  
                    create: reqBody['courses'].map(courseName => ({ name: courseName }))
                }
            },
            include: { courses: true }, 
        })

        return NextResponse.json({status: 'success', data: result})
        
    } catch (error) {
        return NextResponse.json({status: "Fail", data: error.message}) 
    }
}



//show single Data
export async function GET(req, res){
    try {
        
        const {searchParams} = new URL(req.url);
        const id = parseInt( searchParams.get('id') );

        const prisma = new PrismaClient();
        
        const result = await prisma.user.findUnique({
            where: {id: id},
            include: {courses: true}
        })

        return NextResponse.json({status: 'success', data: result})
    } catch (error) {
        return NextResponse.json({status: "Fail", data: error.message}) 
    }
}


