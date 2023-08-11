import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";
import Replicate from "replicate";
import axios from "axios";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(
    req: Request
){
    try {
        const { userId } = auth();
        const messages = await req.json();
       

        if (!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // if (!configuration.apiKey) {
        //     return new NextResponse("OpenAI API Key not configured", { status: 500 });
        // }

        if(!messages) {
            return new NextResponse("Messages are required", { status: 400 });
        }
        // const replicate = new Replicate({
        //     auth: "r8_ICat5v7bCCyZ17FUvo4CI6uTwVVwhG32BFhp5",
        //   });
          
        //   const output: any = await replicate.run(
        //     "replicate/vicuna-13b:6282abe6a492de4145d7bb601023762212f9ddbbe78278bd6771c8b3b2f2a13b",
        //     {
        //       input: {
        //         prompt: "What is radius?"
        //       }
        //     }
        //   );
        // const result = output.join(' ')
        // console.log(messages)
        

        
          
        // const response = await openai.createChatCompletion({
        //     model: "gpt-3.5-turbo",
        //     messages
        // });
    
    } catch (error) { 
        return new NextResponse("Internal Error", { status: 500 });
    }
}
