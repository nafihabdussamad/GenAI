"use client"

import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Heading from "@/components/heading";
import Empty from "@/components/empty";

import { amountOptions, formSchema, resolutionOptions } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import Loader from "@/components/loader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";

export default function ImagePage(){
    const router = useRouter()
    const [images, setImages] = useState<string[]>([])
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            amount: "1",
            resolution: "512x512"
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setImages([]);
            const BASE_URL = 'https://api.luan.tools/api/tasks/';
            const header = {
                "Content-Type": 'application/json',
                "Authorization": `Bearer GeEKsA3dlByYKQ0kUjxBvTzICws6f03j`,
                
            }
            var response:any = await axios.post(BASE_URL, { "use_target_image": false,
             }, {headers: header}).catch(error => console.log(error.response));
    
            const task_id = response.data.id
            const task_url = BASE_URL + task_id
            
            const put_payload = {
                
                'input_spec': {
                    'style': 17,
                    'prompt': values.prompt,
                    'width': 960,
                    'height': 1560,
                }
            }
            await axios.put(task_url,  JSON.stringify(put_payload), {headers: header}).then(response => console.log(response)).catch(error => console.log(error.response));
            
            while (true == true) {
                var get_response:any = await axios.get(task_url, {headers: header}).catch(error => console.log(error.response));
                
                var state = get_response.data.state;
            
                if (state == "generating") {
                    console.log("generating");
                } else if (state == "failed") {
                    console.log("failed!");
                    break;
                } else if (state == "completed") {
                    console.log("completed");
                    console.log(get_response.data)
                    var final_url = get_response.data.result;
                    setImages([final_url])
                    form.reset()
                    break;
                    
                }
                
            }
            
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
                title="Image Generation"
                description="Turn your prompt to an image"
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
                />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField 
                                name="prompt"
                                render={({field}) => (
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                            <Input 
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading} 
                                            placeholder="A boy riding a horse" 
                                            {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="amount"
                                render={({field}) => (
                                <FormItem className="col-span-12 lg:col-span-2">
                                  <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {amountOptions.map((option) => (
                                                <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                >
                                                {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                  </Select>
                                </FormItem>
                                )}/>
                            <FormField 
                                control={form.control}
                                name="resolution"
                                render={({field}) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                    <Select
                                    disabled={isLoading}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    value={field.value}
                                    >
                                    
                                        <FormControl>
                                            <SelectTrigger>
                                            <SelectValue defaultValue={field.value}/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {resolutionOptions.map((option) => (
                                                <SelectItem
                                                key={option.value}
                                                value={option.value}
                                                >
                                                {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    </FormItem>
                                )}/>
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}
                    {images.length === 0 && !isLoading && (
                        <Empty label="No images generated"/>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                        {images.map((src) => (
                            <Card
                            key = {src}
                            className="rounded-lg overflow-hidden"
                            >
                                <div className="relative aspect-square">
                                    <Image 
                                    alt="image"
                                    fill
                                    src={src}
                                    />
                                </div>
                                <CardFooter className="p-2">
                                    <Button 
                                    onClick={() => window.open(src)}
                                    variant="secondary" 
                                    className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}