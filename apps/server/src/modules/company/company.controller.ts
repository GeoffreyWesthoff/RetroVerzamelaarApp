import { Body, Controller, Get, Post, Delete, Put, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company-dto';
import { CompanyService } from './company.service';
import * as crypto from "crypto";
import { Company } from 'src/schemas/company.schema';
import { Game } from 'src/schemas/game.schema';

function isNoneType(x: any) {
    return x === null || x === undefined;
}

@Controller('company')
export class CompanyController {

    constructor(private readonly companyService: CompanyService) {}

    @Post()
    async create(@Body() createCompanyDto: CreateCompanyDto) {
        createCompanyDto.id = crypto.randomBytes(64).toString('hex');

        if (isNoneType(createCompanyDto.annual_revenue) || isNoneType(createCompanyDto.country) || isNoneType(createCompanyDto.establishment_year) || isNoneType(createCompanyDto.name) || isNoneType(createCompanyDto.image_url)) {
            throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST)
        }

        if (isNaN(createCompanyDto.annual_revenue)) {
            throw new HttpException('Field annual_revenue is not a number', HttpStatus.BAD_REQUEST)
        }


        const company =  await this.companyService.create(this.companyService.toNeo4j(createCompanyDto)).run();
        return company;
    }

    @Get()
    async findAll() {
        return await this.companyService.findAll().run();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<any> {
        const companies = await this.companyService.findBy(this.companyService.toNeo4j({id: id})).run()
        return companies[0];
    };

    @Get(':id/best')
    async getBest(@Param('id') id: string): Promise<Game[]> {
        return this.companyService.getBest(id);
    }

    @Post('search')
    async search(@Body() body: any) {
        return await this.companyService.search(body.input);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<any> {
        return await this.companyService.delete(this.companyService.toNeo4j({id: id}), {returns: true}).run()
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updatedCompany: CreateCompanyDto): Promise<Company> {
        updatedCompany.id = id;

        if (isNoneType(updatedCompany.annual_revenue) || isNoneType(updatedCompany.country) || isNoneType(updatedCompany.establishment_year) || isNoneType(updatedCompany.name) || isNoneType(updatedCompany.image_url)) {
            throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST)
        }

        if (isNaN(updatedCompany.annual_revenue)) {
            throw new HttpException('Field annual_revenue is not a number', HttpStatus.BAD_REQUEST)
        }

        const companies = await this.companyService.update({id: id}, this.companyService.toNeo4j(updatedCompany), {mutate: true, returns: true}).run()
        return companies[0];
    }

}
