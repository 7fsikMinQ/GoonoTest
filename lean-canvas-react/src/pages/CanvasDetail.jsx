import { useParams } from 'react-router-dom'
import CanvasTitle from '../components/CanvasTitle'
import LeanCanvas from '../components/LeanCanvas'
// import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { getCanvasById, updateCanvas, updateTitle } from '../api/canvas'
function CanvasDetail() {
  // const { id } = useParams()
  // const [canvas, setCanvas] = useState()

  // useEffect(() => {
  //   const fetchCanvas = async () => {
  //     const data = await getCanvasById(id)
  //     setCanvas(data)
  //   }
  //   fetchCanvas()
  // }, [id])

  // const handleTitleChange = async title => {
  //   try {
  //     await updateTitle(id, title)
  //   } catch (err) {
  //     alert(err.message)
  //   }
  // }

  // const handleCanvasChange = async updatedCanvas => {
  //   try {
  //     await updateCanvas(id, updatedCanvas)
  //     setCanvas(updatedCanvas)
  //   } catch (err) {
  //     alert(err.message)
  //   }
  // }

  const { id } = useParams()
  const queryClient = useQueryClient()

  const {
    data: canvas,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['canvas', id],
    queryFn: () => getCanvasById(id),
  })

  const updateTitleMutation = useMutation({
    mutationFn: newTitle => updateTitle(id, newTitle),
    onSuccess: () => queryClient.invalidateQueries(['canvas', id]),
  })

  const updateCanvasMutation = useMutation({
    mutationFn: updatedCanvas => updateCanvas(id, updatedCanvas),
    onSuccess: () => queryClient.invalidateQueries(['canvas', id]),
  })

  const handleTitleChange = title => {
    updateTitleMutation.mutate(title)
  }

  const handleCanvasChange = updatedCanvas => {
    updateCanvasMutation.mutate(updatedCanvas)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <div>
      <CanvasTitle value={canvas?.title} onChange={handleTitleChange} />
      {canvas && (
        <LeanCanvas canvas={canvas} onCanvasChange={handleCanvasChange} />
      )}
    </div>
  )
}

export default CanvasDetail
