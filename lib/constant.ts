import { TFunction } from "i18next"

export const onGetPhotoSize = (t:TFunction<string, undefined>) => {
  return [
    { label: t('home:photo_size.custom'), value: 'Custom', width: 0, height: 0 },
    { label: t('home:photo_size.background'), value: 'Background', width: 0, height: 0 },
    { label: t('home:photo_size.one_inch'), value: 'One inch', width: 295, height: 413 },
    { label: t('home:photo_size_two_inches'), value: 'Two inches', width: 413, height: 626 },
    { label: t('home:photo_size_small_inch'), value: 'Small inch', width: 260, height: 378 },
    { label: t('home:photo_size_two_inches_small'), value: 'Two inches small', width: 413, height: 531 },
    { label: t('home:photo_size_one_inch_larger'), value: 'One inch larger', width: 390, height: 567 },
    { label: t('home:photo_size_two_inches_in_size'), value: 'Two inches in size', width: 413, height: 626 },
    { label: t('home:photo_size_five_inches'), value: 'Five inches', width: 1050, height: 1499 },
    { label: t('home:photo_size_teacher_qualification_certificate'), value: 'Teacher Qualification Certificate', width: 295, height: 413 },
    { label: t('home:photo_size_national_civil_service_examination'), value: 'National Civil Service Examination', width: 295, height: 413 },
    { label: t('home:photo_size_junior_accounting_exam'), value: 'Junior Accounting Exam', width: 295, height: 413 },
    { label: t('home:photo_size_english'), value: 'English CET-4 and CET-6 exams', width: 144, height: 192 },
    { label: t('home:photo_size_computer_rank_examination'), value: 'Computer Rank Examination', width: 390, height: 567 },
    { label: t('home:photo_size_graduate_student_entrance_examination'), value: 'Graduate student entrance examination', width: 531, height: 709 },
    { label: t('home:photo_size_social_security_card'), value: 'Social security card', width: 358, height: 441 },
    { label: t('home:photo_size_license'), value: `Electronic driver's license`, width: 260, height: 378 },
    { label: t('home:photo_size_US_visa'), value: 'US Visa', width: 600, height: 600 },
    { label: t('home:photo_size_japanese_visa'), value: 'Japanese Visa', width: 295, height: 413 },
    { label: t('home:photo_size_korean_visa'), value: 'Korean Visa', width: 413, height: 531 },
  ]
}

export const onGetBackground = (t:TFunction<string, undefined>) => {
  return [
    { label: t('home:background.blue'), color: '#628bce', key: 'blue' },
    { label: t('home:background.red'), color: '#d74532', key: 'red' },
    { label: t('home:background.white'), color: '#ffffff', key: 'white' },
    { label: t('home:background.black'), color: '#000000', key: 'black' },
    { label: t('home:background.light_gray'), color: '#f2f0f0', key: 'light_gray' },
    { label: t('home:background.custom'), color: '#40c057', key: 'custom' },
  ]
}

export const onGetRenderingMethod = (t:TFunction<string, undefined>) => {
  return [
    { label: t('home:rendering_method.solid_color'), value: 0 },
    { label: t('home:rendering_method.up_and_down_gradient'), value: 1 },
    { label: t('home:rendering_method.center_gradient'), value: 2 },
  ]
}










