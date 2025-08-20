import SuccessClient from './success-client'

export default async function SuccessPage({
                                              searchParams,
                                          }: {
    searchParams: Promise<{ id?: string }>
}) {
    const { id } = await searchParams
    return <SuccessClient id={id} />
}
