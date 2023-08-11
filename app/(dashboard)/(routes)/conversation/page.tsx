"use client"

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Bot, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/heading";
import Empty from "@/components/empty";

import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";

import { ChatCompletionRequestMessage } from "openai";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";


export default function ConversationPage(){
    const router = useRouter()
    const [messages, setMessages] = useState<any>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage = {role: "user", content: values.prompt}
            const response:any = await axios({
                method: 'post', 
                url: "https://free.churchless.tech/v1/chat/completions",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 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',
                },
                data:{
                    "model": "gpt-3.5-turbo",
                    "messages": [{"role": "user", "content": userMessage.content}]
                  },
              })
                .then(response => {
                    const resMessage = {role: "AI", content: response.data.choices[0].message.content}
                    setMessages([...messages, userMessage, resMessage]); 
                    form.reset();
                })
        
            
        } catch (error: any){
            // TODO PRO
            console.log(error);
        } finally {
            router.refresh();
        }
    };


    return (
        <div>
            <Heading 
                title="Conversation"
                description="Our most advanced conversation model"
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
                />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField 
                                name="prompt"
                                render={({field}) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input 
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading} 
                                            placeholder="How do I calculate the radius of a circle?" 
                                            {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-mutes">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No Conversation started"/>
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                     {messages.map((message:any) => (
                        <div 
                        key={message.content}
                        className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg",
                        message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                        )}
                        >
                            {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                            <p className="text-sm">{message.content}</p>
                        </div>
                    
                        ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}