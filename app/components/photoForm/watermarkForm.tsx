import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { FormStore, useFormStore } from "@/app/stores/use-form-store";
import throttle from "lodash/throttle";

interface IProps {
  locale: string;
}
export const WatermarkForm = (params: IProps) => {
  const { t } = useTranslation(params.locale)
  const [reset, setReset] = useState('')
  const { updateAll, watermarkData } = useFormStore((state) => ({ updateAll: state.updateAll, watermarkData: state.watermarkData }))

  const onSaveData = (key: keyof FormStore['watermarkData'], value: any) => {
    // @ts-ignore
    updateAll({ watermarkData: { [key]: value } });
  };

  const handleColorChange = throttle((value: string) => {
    onSaveData('color', value)
  }, 150);

  const memoizedColorPicker = useMemo(() => (
    <div className="flex justify-between gap-5 relative">
      <Input
        placeholder={t('home:watermark.text')}
        style={{ color: watermarkData.color }}
        value={watermarkData.text}
        onChange={(e) => onSaveData('text', e.target.value)}
      />
      <input className='h-auto' type="color" value={watermarkData.color} onChange={e => handleColorChange(e.target.value)} />
    </div>
  ), [watermarkData.color, watermarkData.text, reset, t])

  const memoizedForm = useMemo(() => (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 text-sm">{t('home:form.watermark.text_size')}({watermarkData.size})</div>
        <Slider value={[watermarkData.size]} min={10} max={100} step={1} onValueChange={(value) => onSaveData('size', value[0])} />
      </div>
      <div>
        <div className="mb-2 text-sm">{t('home:form.watermark.transparency')}({watermarkData.opacity})</div>
        <Slider value={[watermarkData.opacity]} min={0} max={1} step={0.01} onValueChange={(value) => onSaveData('opacity', value[0])} />
      </div>
      <div>
        <div className="mb-2 text-sm">{t('home:form.watermark.text_perspective')}({watermarkData.angle})</div>
        <Slider value={[watermarkData.angle]} min={0} max={360} step={1} onValueChange={(value) => onSaveData('angle', value[0])} />
      </div>
      <div>
        <div className="mb-2 text-sm">{t('home:form.watermark.spacing')}({watermarkData.space})</div>
        <Slider value={[watermarkData.space]} min={10} max={200} step={1} onValueChange={(value) => onSaveData('space', value[0])} />
      </div>
    </div>
  ), [reset, t, watermarkData.size, watermarkData.opacity, watermarkData.angle, watermarkData.space]);

  useEffect(() => {
    if (!watermarkData.useWatermark) {
      updateAll({
        watermarkData: {
          color: '#000',
          size: 20,
          text: '',
          useWatermark: false,
          opacity: 0.15,
          angle: 30,
          space: 25,
        }
      });
    }
  }, [watermarkData.useWatermark])

  useEffect(() => {
    setReset(params.locale)
  }, [t, params.locale])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span>{t('home:watermark.title')}</span>
        <Switch id="open_watermark_form" checked={watermarkData.useWatermark} onCheckedChange={(value) => onSaveData('useWatermark', value)} />
      </div>
      {
        watermarkData.useWatermark &&
        <>
          {memoizedColorPicker}
          {memoizedForm}
        </>
      }
    </div>
  )
}