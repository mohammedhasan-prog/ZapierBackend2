import z from 'zod';

export const SignupData = z.object({
  
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password is required' }),
  name: z.string()
});

export const SigninData = z.object({
    
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6, { message: 'Password is required' }),
  });

  export const ZapCreateSchema = z.object({
    avilableTriggerId : z.string(),
    triggerMeta: z.any().optional(),
    actions: z.array(z.object({
      availableactionId: z.string(),
      actionMeta: z.any().optional(),
      
    })),


  });