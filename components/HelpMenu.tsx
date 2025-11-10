"use client";
import { FC, useState } from 'react';
import { HelpCircle, Eye, EyeOff, MessageSquare } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import GlassContainer from './GlassContainer';
import { useVenueNameVisibility } from '@/hooks/VenueNameVisibilityProvider';
import FeedbackModal from './FeedbackModal';

interface HelpMenuProps {
  className?: string;
}

const HelpMenu: FC<HelpMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { showVenueNames, toggleVenueNames } = useVenueNameVisibility();

  // const handleAddVenue = () => {
  //   // TODO: Implement add venue functionality
  //   console.log('Add venue clicked');
  //   setIsOpen(false);
  // };

  const handleFeedbackClick = () => {
    setIsOpen(false);
    setFeedbackModalOpen(true);
  };

  return (
    <>
      <FeedbackModal open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen} />
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={`${className}`}>
          <GlassContainer className="p-3 cursor-pointer hover:bg-white/20 transition-colors">
            <HelpCircle className="w-6 h-6 text-white" />
          </GlassContainer>
        </div>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-56 p-0 border-0 bg-transparent shadow-none"
      >
        <GlassContainer className="p-2 flex flex-col">
          {/* Toggle venue names */}
            <button
              onClick={toggleVenueNames}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-500/20 rounded-full">
                {showVenueNames ? (
                  <EyeOff className="w-4 h-4 text-indigo-300" />
                ) : (
                  <Eye className="w-4 h-4 text-indigo-300" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium">
                  {showVenueNames ? 'Hide venue names' : 'Show venue names'}
                </div>
                <div className="text-xs text-white/60">
                  {showVenueNames ? 'Remove map labels' : 'Display labels on map'}
                </div>
              </div>
            </button>
          {/* Add venue */}
          {/* <button
            onClick={handleAddVenue}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/20 rounded-full">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-medium">Add a venue</div>
              <div className="text-xs text-white/60">Report a new coffee location</div>
            </div>
          </button> */}
          {/* Submit feedback */}
          <button
            onClick={handleFeedbackClick}
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-full">
              <MessageSquare className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <div className="text-sm font-medium">Submit feedback</div>
              <div className="text-xs text-white/60">Share your thoughts</div>
            </div>
          </button>
        </GlassContainer>
      </PopoverContent>
    </Popover>
    </>
  );
};

export default HelpMenu;
