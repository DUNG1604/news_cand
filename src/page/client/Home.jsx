import React from 'react'
import Book from '../../components/Book'
import SEO from '../../components/SEO'
import useStore from '../../store/useStore'

function Home() {
  const { selectedChapter } = useStore();

  // Dynamic SEO based on selected chapter
  const getSEOData = () => {
    if (selectedChapter) {
      return {
        title: `${selectedChapter.title} - Cẩm nang phòng chống tội phạm`,
        description: `${selectedChapter.content?.substring(0, 150) || ''}...`,
        keywords: `${selectedChapter.title}, cẩm nang phòng chống tội phạm, công an quảng ninh`
      };
    }
    return {};
  };

  return (
    <>
      <SEO {...getSEOData()} />
      <Book selectedChapter={selectedChapter} />
    </>
  )
}

export default Home
