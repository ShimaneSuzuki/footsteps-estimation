distance.cal<-function(){
  timedata <- read.csv(file = "dateArr.csv",sep = "")
  knee <- sqrt(( ori[1]- ori[3] )^2 + (ori[2] - ori[4] )^2 )
  ankle <- sqrt(( ori[5]- ori[7] )^2 + (ori[6] - ori[8] )^2 )
  wrist <- sqrt(( ori[9]- ori[11] )^2 + (ori[10] - ori[12] )^2 )
  
  return(data.frame(Time=timedata,Knee=knee,Ankle=ankle,Wrist=wrist))
}

distance.plot<-function(target){
  plot(target)
}