
/**
  * @template Generates an ID photo (with transparent background)
  *  input_image            file    Optional, choose between input_image and input_image_base64    The input image file, which should be an RGB three-channel image.
  *  input_image_base64     str     Optional, choose between input_image and input_image_base64    The base64 encoding of the input image file, which should be an RGB three-channel image.
  *  height                 int     Optional   The standard height of the ID photo, default is 413.
  *  width                  int     Optional   The standard width of the ID photo, default is 295.
  *  human_matting_model    str     Optional   The human matting model, default is modnet_photographic_portrait_matting. Options are modnet_photographic_portrait_matting, hivision_modnet, rmbg-1.4, birefnet-v1-lite.
  *  face_detect_model      str     Optional   The face detection model, default is mtcnn. Options are mtcnn, face_plusplus, retinaface-resnet50.
  *  hd                     bool    Optional   Whether to generate a high-definition ID photo, default is true.
  *  dpi                    int     Optional   The image resolution, default is 300.
  *  face_alignment         bool    Optional   Whether to perform face alignment, default is true.
  *  head_measure_ratio     float   Optional   The ratio of face area to photo area, default is 0.2.
  *  head_height_ratio      float   Optional   The ratio of face center to the top of the photo height, default is 0.45.
  *  top_distance_max       float   Optional   The maximum ratio of the distance between the head and the top of the photo, default is 0.12.
  *  top_distance_min       float   Optional   The minimum ratio of the distance between the head and the top of the photo, default is 0.1.
 */
export interface IIdphoto {
    input_image?: File;
    input_image_base64?: string;
    input_image_bs64?: string;
    height?: number;
    width?: number;
    human_matting_model?: string;
    face_detect_model?: string;
    hd?: boolean;
    dpi?: number;
    face_alignment?: boolean;
    head_measure_ratio?: boolean;
    head_height_ratio?: boolean;
    top_distance_max?: number;
    top_distance_min?: number;
}


/**
 * @template Add Background Color
 *  input_image         file    Optional, choose between input_image and input_image_base64    The input image file, which should be an RGBA four-channel image.
 *  input_image_base64  str     Optional, choose between input_image and input_image_base64    The base64 encoding of the input image file, which should be an RGBA four-channel image.
 *  color               str     Optional   The HEX value of the background color, default is 000000.
 *  kb                  int     Optional   The target size in KB for the output image, default is None, meaning no KB adjustment is applied.
 *  render              int     Optional   The rendering mode, default is 0. Options are 0, 1, 2, which correspond to solid color, vertical gradient, and center gradient respectively.
 *  dpi                 int     Optional   The image resolution, default is 300.
 */
export interface IAddBackground {
    input_image?: File;
    input_image_base64?: string;
    input_image_bs64?: string;
    input_image_url?: string;
    color?: string;
    kb?: number;
    render?: number;
    dpi?: number;
}
/**
 * @template Generate 6-Inch Layout Photo
 *  input_image         file    Optional, choose between input_image and input_image_base64    The input image file, which should be an RGB three-channel image.
 *  input_image_base64  str     Optional, choose between input_image and input_image_base64    The base64 encoding of the input image file, which should be an RGB three-channel image.
 *  height              int     Optional   The height of the input image, default is 413.
 *  width               int     Optional   The width of the input image, default is 295.
 *  kb                  int     Optional   The target size in KB for the output photo, default is None, meaning no KB adjustment is applied.
 *  dpi                 int     Optional   The image resolution, default is 300.
 */
export interface IGenerateLayoutPhotos {
    input_image?: FileList;
    input_image_base64?: string;
    input_image_bs64?: string;
    input_image_url?: string;
    height?: number;
    width?: number;
    kb?: number;
    dpi?: number;
}

/**
 * @template Add Watermark to Image
 *  input_image         file    Optional, choose between input_image and input_image_base64    The input image file, which should be an RGB three-channel image.
 *  input_image_base64  str     Optional, choose between input_image and input_image_base64    The base64 encoding of the input image file, which should be an RGB three-channel image.
 *  text                str     Optional   The watermark text, default is "Hello".
 *  size                int     Optional   The font size of the watermark, default is 20.
 *  opacity             float   Optional   The opacity of the watermark, default is 0.5.
 *  angle               int     Optional   The rotation angle of the watermark, default is 30.
 *  color               str     Optional   The color of the watermark, default is #000000.
 *  space               int     Optional   The spacing of the watermark, default is 25.
 *  dpi                 int     Optional   The image resolution, default is 300.
 */
export interface IWatermark {
    input_image?: FileList;
    input_image_base64?: string;
    input_image_bs64?: string;
    input_image_url?: string
    text?: string;
    size?: number;
    opacity?: number;
    angle?: number;
    color?: string;
    space?: number;
    dpi?: number;
}

