export default class TimeEntry {
    
    startHM; 
    endHM; 
    month; 
    day; 
    totalTime; 
 

    constructor(startTime, endTime) {
        // Do we need to consider dates that wrap over? 
        const startDate = new Date(startTime); 
        const endDate = new Date(endTime); 

        this.day = startDate.getDate(); 
        this.month = startDate.getMonth() + 1; 

        this.startHM = `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2,'0')}`
        this.endHM = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2,"0")}`
        //Total time is absolute time difference in minutes  
        this.totalTime = Math.round((endDate.getTime() - startDate.getTime()) / 60000); 
    }

    startTime() {
        return this.startHM; 
    }
    endTime() {
        return this.endHM;
    }
    absoluteTime() { 
        const hours = Math.floor(this.totalTime / 60) 
        const minutes = this.totalTime % 60; 

        return `${hours}.${String(minutes).padStart(2, "0")}`; 

    }

    formattedDay() {
        return `${this.month}/${this.day}`
    }


    exportValues() {
        return {'Date': this.formattedDay(),
        'Clock-in':this.startTime(), 
        'Clock-Out':this.endTime(), 
        'Hours':this.absoluteTime(),
    } 
    }

}

