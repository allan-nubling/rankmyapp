import { NextFunction, Request, Response } from 'express'

// import { BadRequest, NotFound, Unauthorized } from '@utils/errors'
import fetch from 'node-fetch'

// function paginate(results, page, limit) {
//     const count = results.length
//     const pages = results.length / limit
// }

class CharactersController {
    static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = '0', limit = '5', name } = req.query as Record<string, string>

            console.log(page, limit)

            let parsedPage = parseInt(page, 10)

            if (parsedPage === 1 || parsedPage === 0) {
                parsedPage = 0
            } else {
                parsedPage -= 1
            }
            const parsedLimit = parseInt(limit, 10)

            const offset = parsedPage * parsedLimit

            const response = await fetch(`https://rickandmortyapi.com/api/character/`)

            const { results: data } = await response.json()

            let parsedData = data as {
                name: string
            }[]

            if (name) {
                parsedData = parsedData.filter(({ name: characterName }): boolean =>
                    characterName.toLowerCase().includes(name.toLowerCase())
                )
            }

            const responseBody = {
                info: {
                    count: parsedData.length,
                    pages: Math.ceil(parsedData.length / parsedLimit)
                },
                results: parsedData.slice(offset, offset + parsedLimit)
            }

            res.json(responseBody)
        } catch (err) {
            next(err)
        }
    }
}

export default CharactersController
