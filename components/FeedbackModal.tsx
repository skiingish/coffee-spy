"use client";
import { FC, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { submitFeedback } from '@/actions/feedback';

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackModal: FC<FeedbackModalProps> = ({ open, onOpenChange }) => {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        message: message.trim(),
        name: name.trim() || undefined,
        contact: contact.trim() || undefined,
      });
      
      toast.success('Thank you for your feedback!');
      setMessage('');
      setName('');
      setContact('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side='bottom' 
        className='max-h-[80vh] flex flex-col p-5 gap-5 text-white bg-black/60 backdrop-blur-md border-white/20 shadow-2xl'
      >
        <SheetHeader className='text-left'>
          <SheetTitle className='text-xl text-white/70 font-semibold tracking-tight'>
            Submit Feedback
          </SheetTitle>
        </SheetHeader>
        
        <div className='space-y-4 overflow-y-auto pr-1 -mr-1 custom-scrollbar'>
          <div className='grid gap-2'>
            <Label htmlFor='feedback-message' className='text-sm font-medium text-white/90'>
              Message <span className='text-red-400'>*</span>
            </Label>
            <textarea
              id='feedback-message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='How can we help?'
              rows={5}
              className='w-full bg-black/40 border border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30 rounded-md p-3 resize-none focus:outline-none'
            />
          </div>
          
          <div className='grid gap-2'>
            <Label htmlFor='feedback-name' className='text-sm font-medium text-white/90'>
              Name (optional)
            </Label>
            <Input
              id='feedback-name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Your name'
              className='bg-black/40 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30'
            />
          </div>
          
          <div className='grid gap-2'>
            <Label htmlFor='feedback-contact' className='text-sm font-medium text-white/90'>
              Contact (optional)
            </Label>
            <Input
              id='feedback-contact'
              type='text'
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder='Email or something else'
              className='bg-black/40 border-white/20 text-white placeholder:text-white/40 focus:ring-2 focus:ring-white/30'
            />
          </div>
        </div>
        
        <div className='flex justify-between items-center pt-3 border-t border-white/10'>
          <Button 
            variant='ghost' 
            size='sm' 
            className='text-white/70 hover:text-white hover:bg-white/10'
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            variant='outline' 
            className='bg-white/10 border-white/20 hover:bg-white/20'
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackModal;
