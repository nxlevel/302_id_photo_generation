'use client'
import ky from 'ky';
import dayjs from 'dayjs';
import Image from 'next/image';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { emitter } from '@/lib/mitt';
import { TiDelete } from "react-icons/ti";
import { CgSpinner } from "react-icons/cg";
import { MdUnfoldMore } from "react-icons/md";
import { MdUnfoldLess } from "react-icons/md";
import { RiUpload2Fill } from "react-icons/ri";
import logo_302 from '../..//public/images/logo.png';
import { Button } from '@/components/ui/button';
import { onGetPhotoSize } from '@/lib/constant';
import { Footer } from '@/app/components/footer';
import { useTranslation } from '@/app/i18n/client';
import { PhotoForm } from '../components/photoForm';
import { useEffect, useRef, useState } from 'react';
import { MdOutlineFileDownload } from "react-icons/md";
import { useFormStore } from '../stores/use-form-store';
import { useUserStore } from '../stores/use-user-store';
import { WatermarkForm } from '../components/photoForm/watermarkForm';
import { addData, deleteData, getData, IIDPhoto } from '@/lib/api/indexedDB';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { env } from 'next-runtime-env';

interface IGenerateResult {
  status: number | string,
  err_code?: number,
  error?: any,
  message?: string;
  data: {
    id_photo_hd: string;
    opacity_bg_image: string;
    six_inch_layout_photo: string;
  }
}

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  const { t } = useTranslation(locale)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [makeTool, setMakeTool] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const [dataSource, setDataSource] = useState<IIDPhoto[]>([]);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const { basicsData, watermarkData, url, updateAll } = useFormStore((state) => ({ ...state }))

  const showBrand = process.env.NEXT_PUBLIC_SHOW_BRAND === "true";

  const handleScroll = () => {
    if ((window.innerHeight + 200) + window.scrollY >= document.documentElement.scrollHeight && !isLoading) {
      onGetData()
    }
  };

  const onGetData = async () => {
    try {
      setIsLoading(true);
      const page = dataSource.length;
      const data = await getData(page);
      setDataSource(() => data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const onMakeIdPhoto = async () => {
    if (!url) {
      toast(t('home:images_url_error'))
      return;
    }
    if (basicsData.size === 'Custom' && (basicsData.height < 1 || basicsData.width < 1)) {
      toast(t('home:custom_size_error'))
      return;
    }
    if (watermarkData.useWatermark && !watermarkData.text) {
      toast(t('home:watermarkText_tips'))
      return;
    }

    try {
      setIsGenerate(true);
      let [width, height] = [basicsData.width, basicsData.height];
      if (['Custom', 'Background'].indexOf(basicsData.size) === -1) {
        const size = onGetPhotoSize(t).find(f => f.value === basicsData.size);
        [width, height] = [size?.width || 295, size?.height || 413]
      }
      // Generate ID photo (transparent parameter on the bottom)
      const cropParams = {
        width,
        height,
        top_distance_max: basicsData.headDistance, // Head distance
        head_measure_ratio: basicsData.headMeasureRatio,//  Facial proportion
        whitening_strength: basicsData.whiteningStrength, // Whitening intensity
        change_bg_only: basicsData.size === 'Background', //BasicData.size==='Background' is true===Only replace the bottom
      }
      // Add background color
      const backgroundParams = {
        color: basicsData.background.color, // backgroundColor
        render: basicsData.renderingMethod, // Render Mode 
      }
      let data: any = {
        cropParams,
        uiLang: locale,
        backgroundParams,
        resource: { url },
        whiteningStrength: basicsData.whiteningStrength,
        generate_layout: !(basicsData.size === 'Background'),
      }
      if (watermarkData.useWatermark) {
        data = { ...data, watermarkParams: watermarkData }
      }
      await onGenerate(data)
    } catch (error) {
      setIsGenerate(false);
    }
  }

  const handleDownload = (src: string) => {
    if (!src) return;
    ky.get(src)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = uuidV4(); 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); 
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        toast(t('home:image_download_error'))
      });
  };

  const onDeleteDialog = (item: IIDPhoto) => {
    const onDel = async () => {
      try {
        await deleteData(item.id || 0)
        await onGetData();
        toast(t('home:delete_success'))
      } catch (error) {
        toast(t('home:delete_error'))
      }
    }
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <span className='text-red-500 cursor-pointer'>{t('home:delete_text')}</span>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('home:delete_data_tips')}</AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('home:cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={onDel}>{t('home:continue')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  const onUpload = async (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].indexOf(file.type) === -1) return;
      setIsUploadLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const imageResult: any = await ky(env("NEXT_PUBLIC_UPLOAD_API_URL")!, {
          method: 'POST',
          body: formData,
          timeout: false,
        }).then(res => res.json());
        if (imageResult?.data?.url) {
          updateAll({ url: imageResult.data.url })
        } else {
          toast(t('home:upload_error'));
        }
      } catch (error) {
        toast(t('home:upload_error'));
      }
      setIsUploadLoading(false)
    }
  };

  const onGenerate = async (data: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const response = await ky(`/api/generate`, {
        method: 'post',
        body: JSON.stringify(data),
        timeout: false,
      })
      const result: IGenerateResult = await response.json();
      if (result.status === 200) {
        const created_at = dayjs().format('YYYY-MM-DD HH:mm:ss')
        const saveData = await addData({ ...result.data, created_at })
        setDataSource((v) => ([{ ...saveData }, ...v]))
      }
      if (result?.status === 'fail' || result?.error) {
        if (result?.error?.err_code) {
          emitter.emit('ToastError', result?.error?.err_code || '')
        } else {
          toast(result?.message || t('home:generate.error'))
        }
      }
      setIsGenerate(false);
    } catch (error) {
      setIsGenerate(false);
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onGetData()
    setMakeTool(window.innerWidth > 768)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dataSource.length, isLoading]);

  return (
    <div className='relative' >
      <div className='my-0 mx-auto py-10 w-full md:max-w-[1200px] '>
        <div className='flex items-center w-full justify-center mb-10'>
          {
            showBrand &&
            <Image alt='ai-302-logo' src={logo_302} quality={100} height={65} width={65} draggable={false} />
          }
          <div className='text-2xl ml-5 font-bold'>{t('home:title')}</div>
        </div>
        {/* 主UI */}
        <div className='flex w-full h-full px-5 md:flex-row flex-col'>
          {/* 制作工具 */}
          <div className={`md:w-[300px] w-full flex flex-col gap-5 mx-auto md:mb-0 mb-5 md:pr-5 md:h-screen md:sticky md:top-5 md:overflow-y-auto md:pb-10`}>
            <div
              className={`${!url && 'border-dashed'} border  border-[hsl(var(--background-reverse))] rounded-xl min-h-[240px] max-h-[240px] h-full cursor-pointer relative overflow-hidden flex flex-col items-center justify-center`}
              onClick={() => fileInputRef?.current?.click()}
              onDragLeave={(e) => { e.preventDefault() }}
              onDragOver={(e) => { e.preventDefault() }}
              onDrop={handleDrop}
            >
              <input disabled={isUploadLoading} type="file" accept=".jpg, .jpeg, .png, .webp" style={{ display: 'none' }} ref={fileInputRef} onChange={(e) => onUpload(e.target.files)} />
              {url && <TiDelete className='absolute right-1 top-1 text-red-500 text-2xl cursor-pointer' onClick={(e) => { e.stopPropagation(); updateAll({ url: '' }) }} />}
              {url && <img src={url} alt="" className='max-h-[240px] object-contain' />}
              {
                isUploadLoading &&
                <div className='absolute left-0 top-0 flex flex-col justify-center items-center w-full h-full bg-[hsl(var(--background-backdrop))] backdrop-blur-sm rounded-xl'>
                  <CgSpinner className='animate-spin text-5xl text-[#7c3aed] mb-2' />
                  <span className='text-sm text-[hsl(var(--background-reverse))]'>{t('home:isUploadLoading')}</span>
                </div>
              }
              {
                (!url && !isUploadLoading) &&
                <>
                  <RiUpload2Fill className='text-5xl mb-5' />
                  <span className='text-sm text-slate-500'>{t('home:drag_image')}</span>
                  <span className='text-sm text-slate-500'>{t('home:click_image')}</span>
                </>
              }
            </div>
            <Button className='w-full' onClick={onMakeIdPhoto} disabled={isGenerate}>{t('home:but_make')}</Button>
            <Button className='w-full flex justify-between items-center border border-[#e7e7e7] bg-white hover:bg-[#fbfbfbe6] text-black' onClick={() => setMakeTool(v => !v)}>
              {t('home:but_make_params')}
              {makeTool ? <MdUnfoldLess className='text-lg' /> : <MdUnfoldMore className='text-lg' />}
            </Button>
            {
              (makeTool && locale) &&
              <>
                <PhotoForm locale={locale} />
                <WatermarkForm locale={locale} />
              </>
            }
          </div>
          <div className='w-[1px] bg-[hsl(var(--background-reverse))] md:block hidden'></div>
          {/* 历史记录 */}
          <div className='flex-1 flex flex-col gap-5 md:pl-5'>
            {
              isGenerate &&
              <div className='flex justify-center items-center flex-col h-[150px] border'>
                <CgSpinner className='animate-spin text-5xl text-[#7c3aed] mb-2' />
                <span className='text-sm text-[hsl(var(--background-reverse))]'>{t('home:generated_ID_Photo')}</span>
              </div>
            }
            {
              dataSource.length ? dataSource.map(item => (
                <div key={item.id}>
                  <div className='gap-5 w-full grid lg:grid-cols-8 grid-cols-2'>
                    <div className={`relative px-5 pt-1 border border-[#949494] lg:lg:col-span-2 col-span-1 ${!item.opacity_bg_image && 'hidden'}`}>
                      <MdOutlineFileDownload className='absolute right-1 top-1 cursor-pointer' onClick={() => handleDownload(item.opacity_bg_image)} />
                      <div className='mb-2 w-full text-center text-xs mx-auto'>{t('home:opacity_bg_img')}</div>
                      <img className='object-cover' src={item.opacity_bg_image} alt="" />
                    </div>
                    <div className={`relative px-5 pt-1 border border-[#949494] lg:lg:col-span-2 col-span-1 ${!item.id_photo_hd && 'hidden'}`}>
                      <MdOutlineFileDownload className='absolute right-1 top-1 cursor-pointer' onClick={() => handleDownload(item.id_photo_hd)} />
                      <div className='mb-2 w-[80%] text-center text-xs mx-auto'>{t('home:high_definition_ID_photo')}</div>
                      <img className='object-cover' src={item.id_photo_hd} alt="" />
                    </div>
                    <div className={`relative px-5 pt-1 border border-[#949494] lg:col-span-4 col-span-2 w-full ${!item.six_inch_layout_photo && 'hidden'}`} >
                      <MdOutlineFileDownload className='absolute right-1 top-1 cursor-pointer' onClick={() => handleDownload(item.six_inch_layout_photo)} />
                      <div className='mb-2 w-full text-center text-xs mx-auto'>{t('home:six_inch_layout_photo')}</div>
                      <img className='object-cover' src={item.six_inch_layout_photo} alt="" />
                    </div>
                  </div>
                  <div className='flex justify-between items-center mt-2 text-sm'>
                    <span className='text-slate-500'>{item.created_at}</span>
                    {onDeleteDialog(item)}
                  </div>
                </div>
              )) :
                <div className={`flex justify-center flex-col items-center gap-10 ${isGenerate && 'hidden'} md:min-h-[80vh]`}>
                  <img className='h-[50%]' src="/images/empty.png" alt="" />
                  <div className='md:text-3xl text-2xl text-slate-400'>{t('home:empty_text')}</div>
                </div>
            }
          </div>
        </div>
      </div>
      {showBrand && <Footer className='py-3' />}
    </div >
  )
}