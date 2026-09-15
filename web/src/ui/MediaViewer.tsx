import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import { asset, type Lang } from '../data/workDocs'
import { mediaLabel } from '../data/editorial'

export default function MediaViewer({ photos, index, onClose, onIndex, lang, reduced }: {
  photos: { src: string; alt: string }[]; index: number; onClose: () => void; onIndex: (index: number) => void; lang: Lang; reduced: boolean
}) {
  return <Lightbox open index={index} close={onClose} plugins={[Zoom, Captions, Counter]}
    slides={photos.map(photo => ({ src: asset(photo.src), alt: photo.alt, title: photo.alt, description: mediaLabel(photo.src, lang) }))}
    on={{ view: ({ index: next }) => onIndex(next) }} animation={{ fade: reduced ? 0 : 200, swipe: reduced ? 0 : 250 }}
    carousel={{ finite: photos.length <= 1, preload: 1 }} controller={{ closeOnBackdropClick: true }}
    zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }} captions={{ descriptionTextAlign: 'center' }}
    labels={lang === 'zh' ? { Close: '关闭', Next: '下一张', Previous: '上一张', 'Zoom in': '放大图片', 'Zoom out': '缩小图片' } : undefined}
  />
}
