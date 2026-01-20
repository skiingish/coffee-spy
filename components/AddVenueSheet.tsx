"use client";
import { FC, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchBox } from "@mapbox/search-js-react";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addVenue } from "@/actions/venues";
import { Loader2 } from "lucide-react";

interface AddVenueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreviewVenue: (venue: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  onClearPreview: () => void;
}

export const AddVenueSheet: FC<AddVenueSheetProps> = ({
  open,
  onOpenChange,
  onPreviewVenue,
  onClearPreview,
}) => {
  const [selectedVenue, setSelectedVenue] = useState<{
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      onClearPreview();
      setSelectedVenue(null);
    }
  };

  const theme = {
    variables: {
      // Match the Coffee Spy dark theme
      fontFamily:
        'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      unit: "14px",
      padding: "0.75em",
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

      // Background colors
      colorBackground: "hsl(24, 9.8%, 10%)", // --card
      colorBackgroundHover: "hsl(240, 3.7%, 15.9%)", // --secondary
      colorBackgroundActive: "hsl(12, 6.5%, 15.1%)", // --accent

      // Text colors
      colorText: "hsl(0, 0%, 95%)", // --card-foreground

      // Primary accent (orange)
      colorPrimary: "hsl(25, 95%, 53%)", // --primary
      colorSecondary: "hsl(240, 5%, 64.9%)", // --muted-foreground

      // Border
      border: "hsl(240, 3.7%, 15.9%)", // --border

      // Backdrop
      colorBackdrop: "rgba(0, 0, 0, 0.6)",

      // Spacing
      spacing: "0.5em",
      paddingModal: "1.5em",

      // Animation
      duration: "200ms",
      curve: "cubic-bezier(0.4, 0, 0.2, 1)",

      // Line height
      lineHeight: "1.5",
    },
    cssText: `
      input {
        color: hsl(0, 0%, 95%) !important;
      }
      input::placeholder {
        color: hsl(240, 5%, 64.9%) !important;
        opacity: 0.7;
      }
    `,
  };

  const handleRetrieve = (res: SearchBoxRetrieveResponse) => {
    const feature = res.features[0];
    const { properties, geometry } = feature;
    const venue = {
      name: properties.name,
      address: properties.full_address || properties.address || "",
      latitude: geometry.coordinates[1],
      longitude: geometry.coordinates[0],
    };
    setSelectedVenue(venue);
    onPreviewVenue(venue);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className={`w-full sm:max-w-md transition-all duration-300 ${
          selectedVenue ? "h-auto max-h-[30vh]" : ""
        }`}
      >
        {!selectedVenue && (
          <SheetHeader>
            <SheetTitle className="text-white">Add a Venue</SheetTitle>
          </SheetHeader>
        )}
        <div
          className={
            selectedVenue
              ? "mt-2 flex flex-col gap-4"
              : "mt-4 flex flex-col gap-4"
          }
        >
          <div
            className={`relative z-50 text-black ${
              selectedVenue ? "mt-10" : ""
            }`}
          >
            <SearchBox
              accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""}
              options={{
                language: "en",
                country: "au",
                types: "poi",
                limit: 5,
                proximity: [144.996933, -37.830474],
              }}
              onRetrieve={handleRetrieve}
              theme={theme}
            />
          </div>

          {selectedVenue && (
            <div className="p-4 bg-white/10 rounded-lg border border-white/20 text-white">
              <h3 className="font-bold text-lg">{selectedVenue.name}</h3>
              <p className="text-sm text-white/60">{selectedVenue.address}</p>
              <div className="mt-4">
                <Button
                  onClick={async () => {
                    setIsSubmitting(true);
                    try {
                      const res = await addVenue(selectedVenue);
                      if (res.error) {
                        toast.error(res.error);
                      } else {
                        toast.success("Venue added successfully!");
                        onOpenChange(false);
                        setSelectedVenue(null);
                      }
                    } catch {
                      toast.error("Failed to add venue");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add Venue
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
