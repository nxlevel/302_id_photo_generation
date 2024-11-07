import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useTranslation } from "@/app/i18n/client";
import { useEffect, useMemo, useState } from "react";
import { FormStore, useFormStore } from "@/app/stores/use-form-store";
import { onGetBackground, onGetPhotoSize, onGetRenderingMethod } from "@/lib/constant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import throttle from 'lodash/throttle';

interface IProps { locale: string }

export const PhotoForm = (params: IProps) => {
  const { t } = useTranslation(params.locale)
  const [reset, setReset] = useState('')
  const { updateAll, basicsData } = useFormStore((state) => ({ updateAll: state.updateAll, basicsData: state.basicsData }))

  const onRenderingMethod = (value: number, color: string) => {
    switch (value) {
      case 1:
        return { backgroundImage: `linear-gradient(${color}, #fff)` }
      case 2:
        return { backgroundImage: `radial-gradient(#fff, ${color})` }
      default:
        return { backgroundColor: color }
    }
  }

  const onSaveData = (key: keyof FormStore['basicsData'], value: any) => {
    // @ts-ignore
    updateAll({ basicsData: { [key]: value } });
  };

  const handleColorChange = throttle((value: string, key: string, color: string) => {
    const tempColor = key === 'custom' ? value : color
    onSaveData('background', { ...basicsData.background, color: tempColor, customColor: value })
  }, 150);

  useEffect(() => {
    setReset(params.locale)
  }, [t, params.locale])

  const colorModular = useMemo(() => (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 text-sm">{t('home:form.background.label')}</div>
        <div className='grid grid-cols-3 gap-5'>
          {onGetBackground(t).map((item, index) => (
            <div
              key={item.key}
              className={`border rounded-xl p-2 text-center cursor-pointer ${item.key === basicsData.background.key ? 'border-[#7c3aed] bg-[#7c3aed1f]' : 'border-[hsl(var(--background-reverse))]'}`}
              onClick={() => {
                const { customColor } = basicsData.background;
                const color = item.key === 'custom' ? customColor : item.color
                onSaveData('background', { key: item.key, color, customColor })
              }}
            >
              {
                item.key === 'custom' ?
                  <input className='h-7 w-full' type="color" value={basicsData.background.customColor} onChange={e => {
                    handleColorChange(e.target.value, item.key, item.color)
                  }} />
                  : <div className='w-full h-7 border border-[hsl(var(--background-reverse))] rounded-sm' style={{ backgroundColor: item.color }} />
              }
              <span className='text-xs text-slate-500 '>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-sm">{t('home:form.rendering_method.label')}</div>
        <div className='grid grid-cols-3 gap-5'>
          {onGetRenderingMethod(t).map(item => (
            <div
              key={item.value}
              className={`border rounded-xl p-2 text-center cursor-pointer ${item.value === basicsData.renderingMethod ? 'border-[#7c3aed] bg-[#7c3aed1f]' : 'border-[hsl(var(--background-reverse))]'}`}
              onClick={() => onSaveData('renderingMethod', item.value)}
            >
              <div className={`w-full h-10 border rounded-sm border-[hsl(var(--background-reverse))]`} style={onRenderingMethod(item.value, basicsData.background.color)} />
              <span className='text-xs text-slate-500 '>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ), [reset, t, basicsData.background, basicsData.renderingMethod])

  const memoizedForm = useMemo(() => (
    <div className="flex flex-col gap-5">
      <div>
        <div className="mb-2 text-sm">{t('home:form.skin_whitening.label')}({basicsData.whiteningStrength})</div>
        <Slider value={[basicsData.whiteningStrength]} max={10} step={1} onValueChange={(value) => onSaveData('whiteningStrength', value[0])} />
      </div>
      <div>
        <div className="mb-2 text-sm">{t('home:form.facial_proportion.label')}({basicsData.headMeasureRatio})</div>
        <Slider value={[basicsData.headMeasureRatio]} max={0.5} min={0.1} step={0.01} onValueChange={(value) => onSaveData('headMeasureRatio', value[0])} />
      </div>
      <div>
        <div className="mb-2 text-sm">{t('home:form.headDistance.label')}({basicsData.headDistance})</div>
        <Slider value={[basicsData.headDistance]} max={0.5} min={0.02} step={0.01} onValueChange={(value) => onSaveData('headDistance', value[0])} />
      </div>
    </div>
  ), [reset, t, basicsData.whiteningStrength, basicsData.headMeasureRatio, basicsData.headDistance])

  const selectSize = useMemo(() => (
    <div>
      <div className="mb-2 text-sm">{t('home:form.size.label')}</div>
      <Select onValueChange={(size) => onSaveData('size', size)} value={basicsData.size}>
        <SelectTrigger>
          <SelectValue placeholder={t('home:form.size.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          {onGetPhotoSize(t).map(item => (<SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>))}
        </SelectContent>
      </Select>
      {
        basicsData.size === 'Custom' &&
        <div className="flex justify-between items-center gap-3 mt-5">
          <div className="">
            <span className="mb-2 text-sm">{t('home:height')}</span>
            <Input value={basicsData.height} onChange={(e) => onSaveData('height', +e.target.value)} />
          </div>
          <div>
            <span className="mb-2 text-sm">{t('home:width')}</span>
            <Input value={basicsData.width} onChange={(e) => onSaveData('width', +e.target.value)} />
          </div>
        </div>
      }
    </div>
  ), [reset, t, basicsData.size, basicsData.height, basicsData.width])

  return (<>
    {selectSize}
    {colorModular}
    {memoizedForm}
  </>)
}