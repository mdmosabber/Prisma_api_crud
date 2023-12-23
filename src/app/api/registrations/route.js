import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req, res){
    try {
        const reqBody = await req.json();
        const prisma = new PrismaClient();

        const createdUsers = [];
        
        for (const item of reqBody) {
            const age = parseInt(item['age']);

            const newUser = await prisma.user.create({
                data: {
                    firstName: item['firstName'],
                    lastName: item['lastName'],
                    age: age,
                    grade: item['grade'],
                    courses: {
                        createMany: {
                            data: item['courses'].map(courseName => ({ name: courseName }))
                        }
                    }
                },
                include: { courses: true }
            });

            createdUsers.push(newUser);
        }

        await prisma.$disconnect(); 

        return NextResponse.json({ status: 'success', data: createdUsers });
    } catch (error) {
        return NextResponse.json({ status: "Fail", data: error.message });
    }
}




//find many data
export async function GET(req, res){
    try {        
        const prisma = new PrismaClient();
        
        const result = await prisma.user.findMany({
           
            include: {courses: true}
        })

        return NextResponse.json({status: 'success', data: result})
    } catch (error) {
        return NextResponse.json({status: "Fail", data: error.message}) 
    }
}