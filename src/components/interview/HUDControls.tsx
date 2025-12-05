"use client";

import type { HudSettings } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings, Text, Palette, Zap, Ghost } from "lucide-react";

interface HUDControlsProps {
  settings: HudSettings;
  setSettings: (settings: HudSettings) => void;
}

export function HUDControls({ settings, setSettings }: HUDControlsProps) {
  const handleSettingsChange = (key: keyof HudSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="absolute top-4 right-4">
          <Settings className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Customize the HUD appearance and AI behavior.
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="font-size"><Text className="inline-block mr-1 h-4 w-4"/>Font Size</Label>
              <Slider
                id="font-size"
                min={12}
                max={23}
                step={1}
                value={[settings.fontSize]}
                onValueChange={(v) => handleSettingsChange('fontSize', v[0])}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="opacity"><Palette className="inline-block mr-1 h-4 w-4"/>Opacity</Label>
              <Slider
                id="opacity"
                min={10}
                max={100}
                step={5}
                value={[settings.opacity]}
                onValueChange={(v) => handleSettingsChange('opacity', v[0])}
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label><Zap className="inline-block mr-1 h-4 w-4"/>AI Style</Label>
              <Select
                value={settings.aiStyle}
                onValueChange={(v) => handleSettingsChange('aiStyle', v)}
              >
                <SelectTrigger className="col-span-2">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Flash">Flash</SelectItem>
                  <SelectItem value="Flash-Lite">Flash-Lite</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Reasoning">Reasoning</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Theme</Label>
               <RadioGroup
                defaultValue={settings.theme}
                onValueChange={(v) => handleSettingsChange('theme', v)}
                className="col-span-2 flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cyan" id="r-cyan" />
                  <Label htmlFor="r-cyan">Cyan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yellow" id="r-yellow" />
                  <Label htmlFor="r-yellow">Yellow</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <RadioGroupItem value="white" id="r-white" />
                  <Label htmlFor="r-white">White</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="ghost-mode" className="flex items-center gap-2">
                <Ghost className="h-4 w-4"/> Ghost Mode
              </Label>
              <Switch
                id="ghost-mode"
                checked={settings.isGhostMode}
                onCheckedChange={(v) => handleSettingsChange('isGhostMode', v)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
