"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileUploader } from "@/components/FileUploader";
import { ChevronRight, ChevronLeft, Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { forwardRef, InputHTMLAttributes } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Valid phone number required"),
  email: z.string().email("Valid email required"),
  facebookLink: z.string().url("Valid URL required"),
  address: z.string().min(5, "Full address required"),
  parentPhone: z.string().optional(),
  parentFacebook: z.string().optional(),
  schoolName: z.string().optional(),
  className: z.string().optional(),
  teacherName: z.string().optional(),
  teacherPhone: z.string().optional(),
  teacherFacebook: z.string().optional(),
  idDocumentUrl: z.string().min(1, "ID Document is required"),
  facePhotoUrl: z.string().min(1, "Face Photo is required"),
  verificationMethod: z.string().min(1, "Verification method required"),
  consent: z.boolean().refine(val => val === true, "You must accept the terms"),
});

type FormData = z.infer<typeof formSchema>;

const steps = [
  { id: 1, title: "Personal" },
  { id: 2, title: "Guardian/School" },
  { id: 3, title: "Verification" },
  { id: 4, title: "Submit" },
];

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { register, control, handleSubmit, trigger, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verificationMethod: "Video Call",
    }
  });

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['fullName', 'phone', 'email', 'facebookLink', 'address'];
    if (currentStep === 2) fieldsToValidate = ['parentPhone', 'parentFacebook', 'schoolName', 'className', 'teacherName', 'teacherPhone', 'teacherFacebook'];
    if (currentStep === 3) fieldsToValidate = ['idDocumentUrl', 'facePhotoUrl', 'verificationMethod'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(s => s + 1);
    }
  };

  const prevStep = () => setCurrentStep(s => s - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      toast.success("Application submitted successfully!");
      router.push("/apply/success");
    } catch (error) {
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-white/[0.02]">
          <h1 className="text-3xl font-bold mb-6">Moderator Application</h1>
          
          {/* Progress Bar */}
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 rounded-full z-0">
              <div 
                className="h-full bg-gold rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${currentStep >= step.id ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.5)]' : 'bg-black border border-white/20 text-white/50'}`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className={`text-xs absolute -bottom-6 whitespace-nowrap font-medium ${currentStep >= step.id ? 'text-gold' : 'text-white/40'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField label="Full Name *" error={errors.fullName?.message} {...register("fullName")} />
                    <InputField label="Phone Number *" type="tel" error={errors.phone?.message} {...register("phone")} />
                    <InputField label="Email Address *" type="email" error={errors.email?.message} {...register("email")} />
                    <InputField label="Facebook Profile Link *" error={errors.facebookLink?.message} {...register("facebookLink")} />
                  </div>
                  <InputField label="Home Address *" error={errors.address?.message} {...register("address")} />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h3 className="text-xl font-medium text-gold mb-4 border-b border-white/10 pb-2">Guardian Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField label="Parent/Guardian Phone" type="tel" error={errors.parentPhone?.message} {...register("parentPhone")} />
                    <InputField label="Parent/Guardian Facebook" error={errors.parentFacebook?.message} {...register("parentFacebook")} />
                  </div>
                  <h3 className="text-xl font-medium text-gold mb-4 border-b border-white/10 pb-2 mt-8">School Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <InputField label="School Name" error={errors.schoolName?.message} {...register("schoolName")} />
                    <InputField label="Class Name" error={errors.className?.message} {...register("className")} />
                    <InputField label="Teacher Name" error={errors.teacherName?.message} {...register("teacherName")} />
                    <InputField label="Teacher Phone" error={errors.teacherPhone?.message} {...register("teacherPhone")} />
                    <InputField label="Teacher Facebook" className="sm:col-span-2" error={errors.teacherFacebook?.message} {...register("teacherFacebook")} />
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 flex items-start gap-4">
                    <ShieldAlert className="w-6 h-6 text-gold shrink-0 mt-0.5" />
                    <div className="text-sm text-gold/90">
                      <p className="font-semibold mb-1">Identity Verification Required</p>
                      <p>Video Call verification or Location Share verification is required after submission to prevent fraud.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <Controller
                        control={control}
                        name="idDocumentUrl"
                        render={({ field }) => (
                          <FileUploader 
                            label="National ID or Birth Certificate *" 
                            folder="moderators/id-documents" 
                            value={field.value}
                            onUploadSuccess={field.onChange} 
                          />
                        )}
                      />
                      {errors.idDocumentUrl && <p className="text-red-400 text-xs mt-2">{errors.idDocumentUrl.message}</p>}
                    </div>
                    <div>
                      <Controller
                        control={control}
                        name="facePhotoUrl"
                        render={({ field }) => (
                          <FileUploader 
                            label="Clear Face Photo *" 
                            folder="moderators/face-photos" 
                            value={field.value}
                            onUploadSuccess={field.onChange} 
                          />
                        )}
                      />
                      {errors.facePhotoUrl && <p className="text-red-400 text-xs mt-2">{errors.facePhotoUrl.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Preferred Verification Method *</label>
                    <select {...register("verificationMethod")} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold transition-colors appearance-none">
                      <option value="Video Call">Video Call</option>
                      <option value="Location Share">Location Share</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="glass p-6 rounded-xl border border-gold/30">
                    <h3 className="text-xl font-bold text-gold mb-4">Review Terms</h3>
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <div className="relative flex items-start pt-1">
                        <input type="checkbox" {...register("consent")} className="w-5 h-5 rounded border-white/20 bg-black/50 text-gold focus:ring-gold focus:ring-offset-black transition-colors" />
                      </div>
                      <span className="text-sm text-white/80 group-hover:text-white transition-colors leading-relaxed">
                        The information provided will be stored securely and used only for moderator verification and, if required by law, provided to the appropriate authorities.
                      </span>
                    </label>
                    {errors.consent && <p className="text-red-400 text-xs mt-2 ml-9">{errors.consent.message}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-10 flex justify-between">
              {currentStep > 1 ? (
                <button type="button" onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}
              
              {currentStep < steps.length ? (
                <button type="button" onClick={nextStep} className="px-6 py-3 bg-gold hover:bg-gold-hover text-black font-bold rounded-xl flex items-center gap-2 transition-colors">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-gold hover:bg-gold-hover disabled:opacity-50 text-black font-bold rounded-xl flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                  {isSubmitting ? "Submitting..." : "Submit Application"} <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const InputField = forwardRef<HTMLInputElement, { label: string; error?: string; className?: string } & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, className, ...props }, ref) => (
    <div className={`flex flex-col gap-1.5 ${className || ''}`}>
      <label className="text-sm font-medium text-white/80">{label}</label>
      <input 
        ref={ref}
        {...props} 
        className={`w-full bg-black/40 border rounded-xl px-4 py-3 focus:outline-none transition-colors ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-gold'}`}
      />
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
);
InputField.displayName = "InputField";
