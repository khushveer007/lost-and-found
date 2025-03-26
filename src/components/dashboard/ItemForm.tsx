import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Input } from "@/components/ui/input"
import { 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormSection 
} from "@/components/ui/form"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { useAuth } from "@/contexts/AuthContext"
import { useItems } from "@/hooks/useItems"
import { useErrorHandler } from "@/hooks/useErrorHandler"
import { validateForm, validationRules } from "@/utils/testUtils"
import { uploadItemImage } from '@/utils/fileUpload'

interface ItemFormProps {
  type: 'lost' | 'found'
  onSuccess?: () => void
  onCancel?: () => void
}

export function ItemForm({ type, onSuccess, onCancel }: ItemFormProps) {
  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [imageUrl, setImageUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // UI state
  const [formTouched, setFormTouched] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess] = useState(false)
  
  // Hooks
  const { user } = useAuth()
  const { createItem } = useItems(type)
  const { error, setError, clearError } = useErrorHandler()
  
  // Categories list
  const categories = [
    "Electronics", "Clothing", "Accessories", "Documents", 
    "Keys", "Bags", "Jewelry", "Other"
  ]

  // Form validation
  const validateItemForm = () => {
    // Create validation rules based on our validation utility
    const rules = {
      name: [validationRules.required('Item name is required')],
      description: [
        validationRules.required('Description is required'),
        validationRules.minLength(10, 'Description should be at least 10 characters')
      ],
      category: [validationRules.required('Category is required')],
      location: [validationRules.required('Location is required')],
      date: [
        validationRules.required('Date is required'),
        (value: string) => {
          const selectedDate = new Date(value);
          const currentDate = new Date();
          return selectedDate > currentDate 
            ? 'Date cannot be in the future'
            : null;
        }
      ]
    };
    
    // Validate the form data
    const formData = { name, description, category, location, date };
    return validateForm(formData, rules);
  }

  // Clear error when component unmounts or form values change
  useEffect(() => {
    if (formTouched) {
      clearError();
    }
    
    return () => clearError();
  }, [name, description, category, location, date, clearError, formTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormTouched(true)
    
    // Validate form
    const errors = validateItemForm();
    const hasErrors = Object.values(errors).some(error => error !== null);
    
    if (hasErrors) {
      // Find the first field with an error
      const firstErrorField = Object.entries(errors)
        .find(([_, errorMsg]) => errorMsg !== null)?.[0];
        
      if (firstErrorField) {
        // Set the error message
        setError(errors[firstErrorField] as string, firstErrorField);
        
        // Focus the field with error
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.focus();
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.classList.add('animate-shake');
          setTimeout(() => {
            errorElement.classList.remove('animate-shake');
          }, 500);
        }
      }
      return;
    }
    
    setIsSubmitting(true)
    clearError()
    
    try {
      if (!user) {
        throw new Error("You must be logged in to report an item")
      }
      
      // Handle image upload if a file was selected
      let imageUrl = ''
      if (imageFile) {
        const uploadResult = await uploadItemImage(imageFile, user.id)
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload image')
        }
        
        imageUrl = uploadResult.url
      } else if (imageUrl) {
        // If they provided a URL directly, use that
        imageUrl = imageUrl
      }
      
      const newItem = {
        name,
        description,
        category,
        location,
        date,
        type,
        status: type === 'lost' ? 'Active' : 'Waiting for owner',
        image_url: imageUrl || undefined,
        user_id: user.id
      }
      
      const result = await createItem(newItem)
      
      if (!result.success) {
        throw new Error(result.error || `Failed to report ${type} item`)
      }
      
      setFormSuccess(true)
      
      // Reset form
      setName("")
      setDescription("")
      setCategory("")
      setLocation("")
      setDate(new Date().toISOString().split('T')[0])
      setImageUrl("")
      setImageFile(null)
      setUploadProgress(0)
      setFormTouched(false)
      
      // Call success callback
      if (onSuccess) {
        setTimeout(onSuccess, 1500)
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit', 'imageFile')
        return
      }
      
      setImageFile(file)
      setFormTouched(true)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Report a {type === 'lost' ? 'Lost' : 'Found'} Item</h2>
        <p className="text-muted-foreground">
          {type === 'lost' 
            ? "Provide details about the item you've lost to help others find it." 
            : "Provide details about the item you've found to help the owner claim it."}
        </p>
      </div>
      
      {error.hasError && (
        <Toast 
          variant="destructive" 
          className="mb-4 animate-enter"
          onClose={clearError}
        >
          <div>
            <ToastTitle>Error</ToastTitle>
            <ToastDescription>{error.message}</ToastDescription>
          </div>
        </Toast>
      )}
      
      {formSuccess && (
        <Toast 
          variant="success" 
          className="mb-4 animate-enter"
          onClose={() => setFormSuccess(false)}
        >
          <div>
            <ToastTitle>Success!</ToastTitle>
            <ToastDescription>
              Your {type} item has been reported successfully.
            </ToastDescription>
          </div>
        </Toast>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection>
          <FormItem className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
            <FormLabel error={!!error.field && error.field === 'name'}>Item Name</FormLabel>
            <FormControl>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFormTouched(true);
                }}
                placeholder="e.g., Black Wallet, Blue Backpack"
                className={`transition-colors ${error.field === 'name' ? "border-destructive" : ""}`}
                aria-required="true"
                aria-invalid={error.field === 'name'}
                aria-describedby={error.field === 'name' ? "name-error" : undefined}
              />
            </FormControl>
            {error.field === 'name' && (
              <FormMessage id="name-error" className="animate-enter">{error.message}</FormMessage>
            )}
          </FormItem>
          
          <FormItem className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
            <FormLabel error={!!error.field && error.field === 'category'}>Category</FormLabel>
            <FormControl>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setFormTouched(true);
                }}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm transition-colors
                  ${error.field === 'category' ? "border-destructive" : "border-input"}`}
                aria-required="true"
                aria-invalid={error.field === 'category'}
                aria-describedby={error.field === 'category' ? "category-error" : undefined}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </FormControl>
            {error.field === 'category' && (
              <FormMessage id="category-error" className="animate-enter">{error.message}</FormMessage>
            )}
          </FormItem>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
              <FormLabel error={!!error.field && error.field === 'location'}>Location</FormLabel>
              <FormControl>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setFormTouched(true);
                  }}
                  placeholder="Where was it lost/found?"
                  className={`transition-colors ${error.field === 'location' ? "border-destructive" : ""}`}
                  aria-required="true"
                  aria-invalid={error.field === 'location'}
                  aria-describedby={error.field === 'location' ? "location-error" : undefined}
                />
              </FormControl>
              {error.field === 'location' && (
                <FormMessage id="location-error" className="animate-enter">{error.message}</FormMessage>
              )}
            </FormItem>
            
            <FormItem className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
              <FormLabel error={!!error.field && error.field === 'date'}>Date</FormLabel>
              <FormControl>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setFormTouched(true);
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className={`transition-colors ${error.field === 'date' ? "border-destructive" : ""}`}
                  aria-required="true"
                  aria-invalid={error.field === 'date'}
                  aria-describedby={error.field === 'date' ? "date-error" : undefined}
                />
              </FormControl>
              {error.field === 'date' && (
                <FormMessage id="date-error" className="animate-enter">{error.message}</FormMessage>
              )}
            </FormItem>
          </div>
          
          <FormItem className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
            <FormLabel error={!!error.field && error.field === 'description'}>Description</FormLabel>
            <FormControl>
              <textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setFormTouched(true);
                }}
                placeholder="Provide detailed description including color, size, distinctive features, etc."
                rows={4}
                className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm resize-y min-h-[100px] transition-colors
                  ${error.field === 'description' ? "border-destructive" : "border-input"}`}
                aria-required="true"
                aria-invalid={error.field === 'description'}
                aria-describedby={error.field === 'description' ? "description-error" : undefined}
              />
            </FormControl>
            {error.field === 'description' && (
              <FormMessage id="description-error" className="animate-enter">{error.message}</FormMessage>
            )}
          </FormItem>
          
          <FormItem className="transition-all duration-300 hover:bg-muted/20 rounded-md p-2 -mx-2">
            <FormLabel>Image</FormLabel>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="flex-1"
                  id="imageFile"
                />
                <span className="text-sm">OR</span>
              </div>
              
              <FormControl>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setFormTouched(true);
                  }}
                  placeholder="https://example.com/image.jpg"
                  aria-required="false"
                />
              </FormControl>
              
              <p className="text-xs text-muted-foreground mt-1">
                Upload an image or provide a URL to help with identification (Max 5MB)
              </p>
              
              {imageFile && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected file: {imageFile.name}</p>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormItem>
          
        </FormSection>
        
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              Cancel
            </Button>
          )}
          
          <AnimatedButton 
            type="submit" 
            isLoading={isSubmitting}
            loadingText="Submitting..."
            aria-disabled={isSubmitting}
          >
            {`Report ${type === 'lost' ? 'Lost' : 'Found'} Item`}
          </AnimatedButton>
        </div>
      </form>
    </div>
  )
}
