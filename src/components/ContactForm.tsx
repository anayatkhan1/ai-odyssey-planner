
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);
    
    // Here you would typically send the data to your backend
    // For now, we'll simulate success with a timeout
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      
      form.reset();
      if (onSuccess) onSuccess();
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-archivo">Your Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="John Doe" 
                    className="border-2 border-black focus-visible:ring-neo-blue" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-archivo">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="your@email.com" 
                    className="border-2 border-black focus-visible:ring-neo-blue" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-archivo">Subject</FormLabel>
              <FormControl>
                <Input 
                  placeholder="How can we help you?" 
                  className="border-2 border-black focus-visible:ring-neo-blue" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-archivo">Your Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us more about your inquiry..." 
                  className="min-h-32 border-2 border-black focus-visible:ring-neo-blue" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-neo-pink text-white border-3 border-black hover:bg-neo-pink/90 shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-archivo group"
          >
            <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            Send Message
            <Sparkles className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
